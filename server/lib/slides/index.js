var bitly = require("../bitly/index.js");




var deleteDocs = function(config, orgid, slide, cb) {

    //1. delete all docs on slide
    //
    //

    //2. delete the docs in content.


    return cb && cb();
};

var saveSlide = function(config, reqBody, orgid, reqsession, cb) {

    var id = reqBody._id;
    var slide = reqBody;

    if (slide.slidegeneralsettings) {
        slide.slidegeneralsettings = {
            adminlabel: slide.slidegeneralsettings.adminlabel || "",
            transparentbackcolor: slide.slidegeneralsettings.transparentbackcolor || false,
            backcolor: slide.slidegeneralsettings.backcolor || "",
            innershadow: slide.slidegeneralsettings.innershadow || false,
            parallaxefect: slide.slidegeneralsettings.parallaxefect || false,
            parallaxmethod: slide.slidegeneralsettings.parallaxmethod || "",
            top: slide.slidegeneralsettings.top || "",
            bottom: slide.slidegeneralsettings.bottom || "",
            right: slide.slidegeneralsettings.right || "",
            left: slide.slidegeneralsettings.left || "",
            phone: slide.slidegeneralsettings.phone || false,
            tablet: slide.slidegeneralsettings.tablet || false,
            desktop: slide.slidegeneralsettings.desktop || false,
            backgroundimageopacity: slide.slidegeneralsettings.backgroundimageopacity || "0"
        }
    }

    if (slide.sliderowsettings) {
        slide.sliderowsettings = {
            fullwidth: slide.sliderowsettings.fullwidth || false,
            customwidth: slide.sliderowsettings.customwidth || false,
            unit: slide.sliderowsettings.unit || false,
            custompercent: slide.sliderowsettings.custompercent || 0,
            custompixel: slide.sliderowsettings.custompixel || 0,
            custom: slide.sliderowsettings.custom || "",
            customgutterwidth: slide.sliderowsettings.customgutterwidth || false,
            gutterwidthvalue: slide.sliderowsettings.gutterwidthvalue || 0,
            custompadmobile: slide.sliderowsettings.custompadmobile || false,
            adminlabel: slide.sliderowsettings.adminlabel || "",
            top: slide.sliderowsettings.top || "",
            bottom: slide.sliderowsettings.bottom || "",
            right: slide.sliderowsettings.right || "",
            left: slide.sliderowsettings.left || "",
            phone: slide.sliderowsettings.phone || false,
            tablet: slide.sliderowsettings.tablet || false,
            desktop: slide.sliderowsettings.desktop || false,
        }
        if (slide.sliderowsettings.customwidth == true) {
            slide.sliderowsettings.fullwidth = false;
        }
    }
    slide.presentid = reqBody.presentid;
    if (typeof id !== 'undefined') {
        slide._id = config.ObjectId(id);
        slide.createdon = new Date();
        slide.updatedon = new Date();
        slide.type = "updated";

    } else {
        slide.createdon = new Date();
        slide.updatedon = new Date();
        slide.type = "created";
    }

    slide.name = reqBody.name;
    slide.sequence = reqBody.sequence;
    slide.orgid = orgid;
    //console.log(slide.slidegeneralsettings);
    slide.backgroundimageopacity = reqBody.backgroundimageopacity / 100;
    slide.floatimageopacity = reqBody.floatimageopacity / 100;
    config.collections.slides.save(slide, function(err, response) {
        saveSlideActivity(config, slide, reqBody, reqsession);
        if (err) {
            return cb(err);
        }
        return cb(response);

    });
};


var saveSlideActivity = function(config, slide, reqBody, reqsession) {
    var slides = {};
    slides.objecttype = "slide";
    slides.type = slide.type;
    slides.activity_name = reqBody.name;
    slides.activity_date = new Date();
    slides.activity_by = reqsession.user.username;
    slides.user_id = reqsession.user.userid;
    config.collections.recentactivity.save(slides, function(err, response) {

    });

};

var getSlidesByPresentationId = function(config, orgid, id, cb) {

    config.collections.slides.find({ "orgid": orgid, "presentid": id }).sort({ sequence: 1 }, function(err, slides) {


        return cb(slides);
    });
};


var getSlide = function(config, orgid, id, cb) {
    config.collections.slides.findOne({ "_id": config.ObjectId(id), "orgid": orgid }, function(err, slide) {
        return cb(slide);
    });
};

var deleteSlide = function(config, orgid, slideid, reqsession, cb) {

    var db = config.collections.slides;
    db.findOne({ _id: config.ObjectId(slideid), orgid: orgid }, function(e, slide) {

        db.remove({ _id: config.ObjectId(slideid), orgid: orgid });

        deleteSlideActivity(config, orgid, slideid, reqsession)

        return cb({ 'status': 'success', 'message': 'Deleted slide successfully' });
    });

};

var deleteSlideActivity = function(config, orgid, slideid, reqsession) {
    var db = config.collections.slides;
    db.findOne({ "_id": config.ObjectId(slideid), "orgid": orgid }, function(e, slide) {
        var deleteSlide = {};
        deleteSlide.objecttype = "slide";
        deleteSlide.type = "deleted";
        if (slide) {
            deleteSlide.activity_name = slide.name;
        }
        deleteSlide.activity_date = new Date();
        deleteSlide.activity_by = reqsession.user.username;
        deleteSlide.user_id = reqsession.user.userid;
        config.collections.recentactivity.save(deleteSlide, function(err, response) {

        });
    });
};

var getSlideData = function(config, reqBody, cb) {
    var data = {};

    config.collections.presentations.findOne({ "_id": config.ObjectId(reqBody.presentid), "orgid": reqBody.orgid }, function(err, present) {
        data.presentidentifier = present.identifier;

        config.collections.organization.findOne({ "_id": config.ObjectID(reqBody.orgid) }, function(err, organization) {
            data.orgidentifier = organization.identifier;

            config.collections.clients.findOne({ "_id": config.ObjectID(present.clientid) }, function(err, client) {

                data.clientidentifier = client.identifier;
                data.url = config.frontend;
                data.sequence = reqBody.sequence;
                var longUrl = data.url + "/" + "presentation/" + data.orgidentifier + "/" + data.clientidentifier + "/" + data.presentidentifier + "/" + "slides/" + data.sequence;

                bitly.shorten(longUrl, function(error, shortUrl) {
                    data.shortUrl = shortUrl;
                    return cb(data);
                });

            });
        });
    });

};

var copySlide = function(config, reqBody, cb) {
    var slideData = reqBody;
    slideData.createdon = new Date();
    config.collections.slides.save(slideData, function(err, response) {
        if (err) {
            return cb(err);
        }
        return cb(response);
    });
};

/*************public function************/
exports.deleteSlide = deleteSlide;
exports.getSlideData = getSlideData;
exports.getSlidesByPresentationId = getSlidesByPresentationId;
exports.getSlide = getSlide;
exports.saveSlide = saveSlide;
exports.copySlide = copySlide;