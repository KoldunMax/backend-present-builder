var async = require("async");



var getMenu = function(config, pid, orgid, cb) {
    var db = config.collections.menus;
    db.findOne({ presentid: pid, orgid: orgid }, function(e, m) {
        // console.log ("menu is ==>", m);
        return cb(m);
    });
};

var getContents = function(config, slideid, cb) {

    var db = config.collections.slidecontent;
    db.find({ slideid: slideid }).sort({ sequence: 1 }, function(e, contents) {
        cb(contents || []);
    });
};


var getSlides = function(config, pid, orgid, cb) {
    var db = config.collections.slides;

    db.find({ presentid: pid, orgid: orgid }).sort({ sequence: 1 }, function(e, slides) {



        if (!slides) {
            return cb([]);
        }

        async.forEach(slides, function(slide, callback) {

            getContents(config, slide._id.toString(), function(contents) {

                slide.contents = contents;
                callback();
            });

        }, function() {
            return cb(slides);
        });


    });
};


var getPresentationByName = function(config, data, cb) {


    //as of now ..just return a mock ..

    var orgName = data.orgName;
    var clientName = data.clientName;
    var presentationName = data.presentationName;


    if (!presentationName || !orgName || !clientName) {
        return res.json({ error: 'invalid parameters' });
    }


    var db = config.collections;


    var docmeta = config.getDocDB().collection('documents');

    var orgQ = { identifier: orgName.toLowerCase() };


    if (config.isValidId(orgName)) {

        orgQ = { _id: config.ObjectId(orgName) };
    }

    db.organization.findOne(orgQ, function(e, org) {

        if (!org) {
            return cb({ error: "invalid organization" }, null);
        }


        var clientQ = { identifier: clientName.toLowerCase(), orgid: org._id.toString() };
        if (config.isValidId(clientName)) {
            clientQ = { _id: config.ObjectId(clientName) };
        }

        db.clients.findOne(clientQ, function(e, client) {


            var pq = { clientid: client._id.toString(), identifier: presentationName.toString(), orgid: org._id.toString() };

            if (config.isValidId(presentationName)) {
                pq = { _id: config.ObjectId(presentationName) };
            }

            db.presentations.findOne(pq, function(e, p) {

                var data = {};
                data.presentation = p;
                data.url = config.frontend;
                if (data.presentation) {
                    data.presentation.ismenuimage = true;
                    docmeta.findOne({ contextid: data.presentation._id.toString() }, function(err, doc) {
                        data.presentation.isimage = true;
                        if (!doc) {
                            data.presentation.isimage = false;
                        }
                    });
                }

                updatePresentationViewCount(config, p);

                //Save count 
                getSlides(config, p._id.toString(), org._id.toString(), function(slides) {
                    data.slides = slides;

                    getMenu(config, p._id.toString(), org._id.toString(), function(menu) {
                        data.menu = menu;
                        if (data.menu) {
                            docmeta.findOne({ contextid: data.menu._id.toString() }, function(err, doc) {

                                data.presentation.ismenuimage = true;
                                if (!doc) {
                                    data.presentation.ismenuimage = false;
                                }

                            });
                        } else {
                            data.presentation.ismenuimage = false;
                        }

                        return cb(null, data);
                    });
                });
            });
        });
    });


};



var updatePresentationViewCount = function(config, p) {
    var db = config.collections.presentations;
    if (p.view_count) {
        p.view_count = p.view_count + 1;
    } else {
        p.view_count = 1;
    }
    p.updatedon = new Date();
    db.save(p, function(error, response) {

    });
};


var getPresentationById = function(config, id, cb) {

    //when id is available - get the orgname, cientname and presenation anme.
    var db = config.collections;
    console.log(db)
    db.presentations.findOne({ _id: config.ObjectId(id) }, function(e, r) {
        if (e || !r) {
            return cb({ error: "invalid presenation" }, null);
        }


        var data = { clientName: r.clientid, orgName: r.orgid, presentationName: id };
        return getPresentationByName(config, data, cb);
    });
};

var getCurrentHomePresent = function(config, id, cb){

    var db = config.collections;
    db.insertmodule.find({ extid: id }, function(e, r) {
        return cb(null,r);
   });
};



/**** All public */
exports.getPresentationByName = getPresentationByName;
exports.getPresentationById = getPresentationById;
exports.getCurrentHomePresent = getCurrentHomePresent;