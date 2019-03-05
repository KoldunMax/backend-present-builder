'use strict';

var _ = require('lodash');
var slideLib = require("../../lib/slides/index.js");

var async = require('async');
var bitly = require("../../lib/bitly/index.js");


// Save/Update slide
var saveSlide = function(req, res) {
    slideLib.saveSlide(req.config, req.body, req.orgid, req.session, function(response) {
        return res.json(response);
    });
};


var getSlidesByPresentationId = function(req, res) {
    slideLib.getSlidesByPresentationId(config, req.orgid, req.params.id, function(err, slides) {
        return res.json(slides);
    });
};



var deleteSlide = function(req, res) {
    var id = req.params.id;
    slideLib.deleteSlide(req.config, req.orgid, id, req.session, function(e, r) {
        return res.json({});
    });
};


var getSlide = function(req, res) {
    slideLib.getSlide(req.config, req.orgid, req.params.id, function(present) {
        return res.json(present);
    });
};


var getSlideUrl = function(req, res) {
    var data = {};
    slideLib.getSlideData(req.config, req.body, function(data) {
        return res.json(data);
    });
};


var saveSequence = function(req, res) {
    var db = req.config.collections.slides;
    var data = req.body;
    async.forEach(data, function(slide, callback) {
        db.update({ _id: req.config.ObjectId(slide.id) }, { $set: { sequence: slide.sequence } }, callback);
    }, function() {
        return res.json({ status: 'ok' });
    })
};

var copySlide = function(req, res) {
    slideLib.copySlide(req.config, req.body, function(data) {
        return res.json(data);
    });
};

/*************************************************/

exports.saveSlide = saveSlide;
exports.getSlide = getSlide;
exports.getSlidesByPresentationId = getSlidesByPresentationId
exports.deleteSlide = deleteSlide;
exports.saveSequence = saveSequence;
exports.getSlideUrl = getSlideUrl;
exports.copySlide = copySlide;