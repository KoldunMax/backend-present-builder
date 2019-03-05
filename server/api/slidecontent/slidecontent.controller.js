'use strict';

var _ = require('lodash');
var contentLib = require("../../lib/contents/index.js");

var async = require('async');



var updateContent = function(config, body, cb) {

    var id = body._id;



    config.collections.slidecontent.findOne({ _id: config.ObjectId(id) }, function(e, r) {

        r.contentType = body.contentType;

        r.updatedon = new Date();


        if (r.contentType == "TEXTEDITOR" || r.contentType == "TEXT") {
            r.content = body.content;
            r.backgroundimageopacity = body.backgroundimageopacity;
            r.backgroundcolor = body.backgroundcolor;
            r.textcolor = body.textcolor;
            r.contentfontfamily = body.contentfontfamily;
            r.contentfontsize = body.contentfontsize;
            r.pdfcontentfontsize = body.pdfcontentfontsize;
        }
        config.collections.slidecontent.save(r, function(e, r) {
            return cb(r);
        });

    });

};


// Save/Update slide
var saveSlideContent = function(req, res) {
    if (!req.body.slideid) {
        return res.json({ error: 'invalid slideid' });
    }
    var slidecontents = req.body;
    if (slidecontents.contentType === 'circlecounter' || slidecontents.contentType === 'barcounter' || slidecontents.contentType === 'pricingtable' ||
        slidecontents.contentType === 'tab' || slidecontents.contentType === 'toggle') {
        slidecontents.phone = req.body.phone || false;
        slidecontents.tablet = req.body.tablet || false;
        slidecontents.desktop = req.body.desktop || false;
    }
    var id = slidecontents._id;
    if (typeof id !== "undefined") {
        slidecontents._id = req.config.ObjectId(id);
        slidecontents.updatedon = new Date();
        slidecontents.type = "updated";
        slidecontents.updatedby = req.session.user.userid.toString();
    } else {
        slidecontents.createdon = new Date();
        slidecontents.type = "created";
        slidecontents.createdby = req.session.user.userid.toString();
    }
    slidecontents.orgid = req.session.user.orgid;
    req.config.collections.slidecontent.save(slidecontents, function(e, response) {
        return res.json(response);
    });
};

var getSlideContentData = function(req, res) {
    req.config.collections.slidecontent.findOne({ "slideid": req.params.id, "contentType": req.params.data },
        function(err, slide) {
            return res.json(slide);
        });
};

var getSlideContentBySlideId = function(req, res) {

    req.config.collections.slidecontent.find({
        "slideid": req.params.slideid,
        "orgid": req.orgid
    }).sort({ sequence: 1 }, function(err, slidecontent) {

        return res.json(slidecontent);

    });
};



var remove = function(req, res) {

    contentLib.deleteContent(req.config, req.orgid, req.config.ObjectId(req.params.id), req.session, function(e, r) {
        return res.json({});
    });



};

var sequence = function(req, res) {




    var db = req.config.collections.slidecontent;

    var data = req.body;

    async.forEach(data, function(content, callback) {

        db.update({ _id: req.config.ObjectId(content.id) }, { $set: { sequence: content.sequence } }, callback);


    }, function() {
        return res.json({ status: 'ok' });
    })


};

var getSlideContent = function(req, res) {
    req.config.collections.slidecontent.find({ "slideid": req.params.id }, function(err, slide) {
        return res.json(slide);
    });
};

var removeSlide = function(req, res) {
    req.config.collections.slidecontent.remove({ "slideid": req.params.id, "contentType": req.params.data },
        function(err, slide) {
            return res.json(slide);
        });
};

var deleteContents = function(req, res) {
    req.config.collections.slidecontent.remove({ "slideid": req.params.slideid }, function(err, slide) {
        return res.json(slide);
    });
};

var getSlideContentByPresentId = function(req, res) {
    req.config.collections.slidecontent.find({ "presentid": req.params.presentid }, function(err, slidecontents) {
        return res.json(slidecontents);
    });
};

var getSlideSelectedContentData = function(req, res) {
    req.config.collections.slidecontent.findOne({ $and: [{ "slideid": req.params.slideid }, { "index": req.params.index }] }, function(err, slidecontents) {
        return res.json(slidecontents);
    });
};

var deleteSlideContent = function(req, res) {
    console.log("resssss", req.params);
    req.config.collections.slidecontent.remove({ $and: [{ "slideid": req.params.slideid }, { "index": req.params.index }] }, function(err, slidecontents) {
        return res.json(slidecontents);
    });
};


/*************************************************/

exports.saveSlideContent = saveSlideContent;
exports.getSlideContentData = getSlideContentData;
exports.getSlideContentBySlideId = getSlideContentBySlideId;
exports.remove = remove;
exports.removeSlide = removeSlide;
exports.sequence = sequence;
exports.getSlideContent = getSlideContent;
exports.deleteContents = deleteContents;
exports.getSlideContentByPresentId = getSlideContentByPresentId;
exports.getSlideSelectedContentData = getSlideSelectedContentData;
exports.deleteSlideContent = deleteSlideContent;