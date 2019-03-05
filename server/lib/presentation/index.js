var docLib = require("../document/index.js");
var slideLib = require("../slides/index.js");
var emailApi = require("../../lib/email/sendurl.js");
var bitly = require("../../lib/bitly/index.js");
var async = require("async");

var deleteDocs = function(config, orgid, presentation, cb) {
    //1. delete the docs on presenation object
    docLib.deleteDoc(config, presentation.backgroundimage, function() {});
    docLib.deleteDoc(config, presentation.floatingimage, function() {});

    //also delete the slides...
    config.collections.slides.find({ presentid: presentation._id.toString() },
        function(e, slides) {
            if (slides) {
                async.forEach(
                    slides,
                    function(slide, callback) {
                        slideLib.deleteSlide(
                            config,
                            orgid,
                            slide._id.toString(),
                            function() {}
                        );

                        callback();
                    },
                    function() {}
                );
            }
        }
    );

    return cb && cb();
};

var saveActivityWhenDeleted = function(config, orgid, presentation) {
    var deletepresentActivity = {};
    deletepresentActivity.objecttype = "presentation";
    deletepresentActivity.type = "deleted";
    deletepresentActivity.presentation_id = presentation._id.toString();
    deletepresentActivity.activity_date = new Date();
    deletepresentActivity.activity_name = presentation.name;
    deletepresentActivity.activity_by = presentation.userid;
    deletepresentActivity.user_id = presentation.userid;
    deletepresentActivity.client_id = presentation.clientid;
    deletepresentActivity.org_id = presentation.orgid;

    config.collections.recentactivity.save(deletepresentActivity, function(
        err,
        response
    ) {});
};

var deletePresentation = function(config, orgid, presentationid, cb) {
    var id = presentationid.toString();

    var db = config.collections.presentations;
    var q = { _id: config.ObjectId(id), orgid: orgid };
    //step1 : get the presenation.
    db.findOne(q, function(e, presentation) {
        db.remove(q);
        deleteDocs(config, orgid, presentation);
        saveActivityWhenDeleted(config, orgid, presentation);
        return cb({ message: "Presentation deleted successfully." });
    });
};

var saveActivity = function(config, present, reqsession) {
    var activity = {};
    activity.objecttype = "presentation";
    activity.type = present.type;
    activity.activity_name = present.name || present.title;
    activity.activity_date = new Date();
    activity.activity_by = reqsession.user.username;
    activity.user_id = reqsession.user.userid.toString();
    activity.org_id = reqsession.user.orgid;
    activity.presentation_id = present._id.toString();
    activity.client_id = present.clientid;
    config.collections.recentactivity.save(activity, function(err, response) {});
};

var savePresentationDetails = function(
    config,
    reqbody,
    reqorgid,
    reqsession,
    cb
) {
    var present = reqbody;
    if (present.sectionsettings) {
        present.sectionsettings = {
            adminlabel: present.sectionsettings.adminlabel || "",
            transparentbackcolor: present.sectionsettings.transparentbackcolor || false,
            backcolor: present.sectionsettings.backcolor || "",
            innershadow: present.sectionsettings.innershadow || false,
            parallaxefect: present.sectionsettings.parallaxefect || false,
            parallaxmethod: present.sectionsettings.parallaxmethod || "",
            top: present.sectionsettings.top || "",
            bottom: present.sectionsettings.bottom || "",
            right: present.sectionsettings.right || "",
            left: present.sectionsettings.left || "",
            phone: present.sectionsettings.phone || false,
            tablet: present.sectionsettings.tablet || false,
            desktop: present.sectionsettings.desktop || false,
            backgroundopacity: present.sectionsettings.backgroundopacity || "0",
        }
    }

    if (present.rowsettings) {
        present.rowsettings = {
            fullwidth: present.rowsettings.fullwidth || false,
            customwidth: present.rowsettings.customwidth || false,
            unit: present.rowsettings.unit || false,
            custompercent: present.rowsettings.custompercent || 0,
            custompixel: present.rowsettings.custompixel || 0,
            custom: present.rowsettings.custom || "",
            customgutterwidth: present.rowsettings.customgutterwidth || false,
            gutterwidthvalue: present.rowsettings.gutterwidthvalue || 0,
            custompadmobile: present.rowsettings.custompadmobile || false,
            adminlabel: present.rowsettings.adminlabel || "",
            top: present.rowsettings.top || "",
            bottom: present.rowsettings.bottom || "",
            right: present.rowsettings.right || "",
            left: present.rowsettings.left || "",
            phone: present.rowsettings.phone || false,
            tablet: present.rowsettings.tablet || false,
            desktop: present.rowsettings.desktop || false,
        }
        if (present.rowsettings.customwidth == true) {
            present.rowsettings.fullwidth = false;
        }
    }
    var id = reqbody._id;

    present.clientid = reqbody.clientid;

    if (typeof id !== "undefined") {
        present._id = config.ObjectId(id);
        present.updatedon = new Date();
        present.type = "updated";
        present.updatedby = reqsession.user.userid.toString();
    } else {
        present.createdon = new Date();
        present.type = "created";
        present.createdby = reqsession.user.userid.toString();
    }
    present.identifier = reqbody.identifier ? reqbody.identifier : reqbody.name.toLowerCase();
    present.description = reqbody.description;
    present.isactive = reqbody.isactive ? reqbody.isactive : false;
    present.orgid = reqorgid;
    present.userid = reqsession.user.userid.toString();
    config.collections.presentations.save(present, function(err, response) {
        saveActivity(config, present, reqsession);
        return cb(response);
    });
};

var toggle = function(config, reqbody, reqorgid, cb) {
    config.collections.presentations.findOne({ _id: config.ObjectId(reqbody.id), orgid: reqorgid }, function(err, present) {
        present.isactive = reqbody.status;
        present.updatedon = new Date();
        present.currentPresent = reqbody.currentPresent;
        if (reqbody.status == false) {
            present.currentPresent.accesscode = false;
        }
        config.collections.presentations.save(present, function(err, presentres) {
            return cb(presentres);
        });
    });
};

var getPresentById = function(config, id, reqorgid, cb) {
    config.collections.presentations.findOne({ _id: config.ObjectId(id), orgid: reqorgid },
        function(err, present) {
            config.collections.templates.findOne({ _id: config.ObjectId(present.template_id) },
                function(err, template) {
                    present.template = template;
                    return cb(present);
                }
            );
        }
    );
};

var copy = function(config, reqbody, reqsession, cb) {
    var presentation = reqbody;
    var id = config.ObjectID(reqbody._id);
    presentation.created = new Date();
    if (id) {
        presentation._id = "";
    }
    config.collections.presentations.save(presentation, function(err, response) {
        copyActivitySave(config, presentation, reqsession);

        return cb({ status: "success", data: response });
    });
};
var copyActivitySave = function(config, presentation, reqsession) {
    var copyActivity = {};
    copyActivity.objecttype = "presentation";
    copyActivity.type = "copied";
    copyActivity.activity_name = presentation.name;
    copyActivity.activity_date = new Date();
    copyActivity.activity_by = reqsession.user.username;
    copyActivity.user_id = reqsession.user.userid;
    copyActivity.org_id = reqsession.user.orgid;
    copyActivity.presentation_id = presentation._id.toString();
    copyActivity.client_id = presentation.clientid;
    config.collections.recentactivity.save(copyActivity, function(
        err,
        response
    ) {});
};

var getPresentationData = function(req, cb) {
    req.config.collections.presentations.find({ orgid: req.orgid }, function(
        err,
        presents
    ) {
        async.eachSeries(
            presents,
            function(p, callback) {
                req.config.collections.templates.find({ _id: req.config.ObjectId(p.template_id) },
                    function(err, template) {
                        p.template = template[0];
                        return callback();
                    }
                );
            },
            function() {
                return cb(presents);
            }
        );
    });
};

var uniquePresentation = function(config, reqparams, cb) {
    var data = { isUniquePresentation: false };
    config.collections.presentations.findOne({ identifier: reqparams.name },
        function(err, identifier) {
            if (identifier) {
                data.isUniquePresentation = true;
            }
            return cb(data);
        }
    );
};

var getPresentByClientId = function(config, reqparams, reqorgid, cb) {
    config.collections.presentations.find({ clientid: reqparams.clientid, orgid: reqorgid },
        function(err, presents) {
            async.eachSeries(
                presents,
                function(p, callback) {
                    config.collections.templates.find({ _id: config.ObjectId(p.template_id) },
                        function(err, template) {
                            p.template = template[0];
                            return callback();
                        }
                    );
                },
                function() {
                    return cb(presents);
                }
            );
        }
    );
};

var mail = function(config, reqparams, reqbody, reqsession, cb) {
    var presentId = reqparams.presentationid;
    var data = {};
    data.email = reqbody.email;
    data.url = reqbody.url;

    config.collections.presentations.findOne({ _id: config.ObjectId(presentId) },
        function(err, present) {
            data.present = present;
            emailApi.send(data, function(error, response) {
                mailActivitySave(config, reqbody, data, reqsession);

                return cb({ message: "Mail sent successfully" });
            });
        }
    );
};

var mailActivitySave = function(config, reqbody, data, reqsession) {
    var sharePresent = {};
    sharePresent.objecttype = "presentation";
    sharePresent.type = "shared";
    sharePresent.activity_name = data.present.name;
    sharePresent.activity_date = new Date();
    sharePresent.activity_by = reqsession.user.username;
    sharePresent.user_id = reqsession.user.userid;
    sharePresent.org_id = reqsession.user.orgid;
    sharePresent.presentation_id = data.present._id.toString();
    sharePresent.client_id = data.present.clientid;
    config.collections.recentactivity.save(sharePresent, function(
        err,
        response
    ) {});
};

var getUrl = function(config, reqbody, reqsession, cb) {
    var data = {};
    config.collections.organization.findOne({ _id: config.ObjectID(reqbody.orgid) },
        function(err, organization) {
            data.orgidentifier = organization.identifier;
            config.collections.clients.findOne({ _id: config.ObjectID(reqbody.clientid) },
                function(err, client) {
                    data.clientidentifier = client.identifier;
                    data.presentidentifier = reqbody.identifier;
                    data.url = config.frontend;
                    var longUrl =
                        data.url +
                        "/" +
                        "presentation/" +
                        data.orgidentifier +
                        "/" +
                        data.clientidentifier +
                        "/" +
                        data.presentidentifier;
                    console.log("longUrl", longUrl);
                    bitly.shorten(longUrl, function(error, shortUrl) {
                        data.shortUrl = shortUrl;
                        data.originalUrl = longUrl;
                        savePreviewActivity(
                            config,
                            organization,
                            client,
                            reqbody,
                            reqsession
                        );
                        return cb(data);
                    });
                }
            );
        }
    );
};

var savePreviewActivity = function(config, org, client, reqbody, reqsession) {
    var preview = {};
    preview.objecttype = "presentation";
    preview.type = "previewed";
    preview.presentation_id = reqbody._id.toString();
    preview.activity_name = reqbody.name;
    preview.activity_date = new Date();
    preview.activity_by = reqsession.user.username;
    preview.user_id = reqsession.user.userid.toString();
    preview.client_id = client._id.toString();
    preview.org_id = org._id.toString();
    config.collections.recentactivity.save(preview, function(err, response) {});
};

var getSlide = function(config, reqorgid, reqparams, cb) {
    config.collections.slides
        .find({ orgid: reqorgid, presentid: reqparams.id })
        .sort({ sequence: 1 }, function(err, slides) {
            return cb(slides);
        });
};

var getRecentPresent = function(config, reqorgid, cb) {
    if (reqorgid) {
        config.collections.presentations
            .find({ orgid: reqorgid }, { clientid: 1, name: 1, view_count: 1, updatedon: 1 })
            .sort({ updatedon: -1 })
            .limit(10, function(err, data) {
                return cb(data);
            });
    } else {
        config.collections.presentations
            .find({}, { clientid: 1, name: 1, view_count: 1, updatedon: 1 })
            .sort({ updatedon: -1 })
            .limit(10, function(err, data) {
                return cb(data);
            });
    }
};

var getCode = function(config, reqparams, cb) {
    config.collections.presentations.findOne({ url: reqparams.presentationurl },
        function(err, presentation) {
            if (!presentation || err) {
                res.json({ error: true });
            } else {
                return cb(presentation);
            }
        }
    );
};

var getPresentationList = function(config, reqorgid, cb) {
    config.collections.presentations
        .find({ orgid: reqorgid })
        .sort({ updatedon: -1 }, function(err, presentations) {
            async.eachSeries(
                presentations,
                function(client, callback) {
                    // console.log("client",client);
                    config.collections.clients.find({
                            _id: config.ObjectId(client.clientid.toString()),
                            orgid: client.orgid.toString()
                        },
                        function(err, customers) {
                            async.eachSeries(
                                customers,
                                function(customer, callback) {
                                    // console.log("client",client);
                                    customer.clientname = customer.name;

                                    return callback();
                                },
                                function() {
                                    return callback();
                                }
                            );
                        }
                    );
                },
                function() {
                    return cb(presentations);
                }
            );
        });
};

/*************public function************/
exports.deletePresentation = deletePresentation;
exports.savePresentationDetails = savePresentationDetails;
exports.getPresentationData = getPresentationData;
exports.toggle = toggle;
exports.getPresentById = getPresentById;
exports.copy = copy;
exports.uniquePresentation = uniquePresentation;
exports.getPresentByClientId = getPresentByClientId;
exports.mail = mail;
exports.getUrl = getUrl;
exports.getSlide = getSlide;
exports.getRecentPresent = getRecentPresent;
exports.getCode = getCode;
exports.getPresentationList = getPresentationList;