'use strict';

var _ = require('lodash');

var async = require('async');


var saveInsertModule = function(req, res) {
    var insmoudule = {};
    insmoudule = req.body;
    if (insmoudule.type === 'circlecounter' || insmoudule.type === 'barcounter' || insmoudule.type === 'pricingtable' ||
        insmoudule.type === 'tab' || insmoudule.type === 'toggle') {
        insmoudule.phone = req.body.phone || false;
        insmoudule.tablet = req.body.tablet || false;
        insmoudule.desktop = req.body.desktop || false;
    }
    var id = req.body._id;

    if (typeof id !== 'undefined') {
        insmoudule._id = req.config.ObjectID(id);
        insmoudule.updatedon = new Date();
    } else {
        insmoudule.createdon = new Date();
    }
    req.config.collections.insertmodule.save(insmoudule, function(err, insertmodule) {
        res.json(insertmodule);
    });

};


var getInsertModule = function(req, res) {

    req.config.collections.insertmodule.find({ "extid": req.params.id }, function(err, insertmodules) {
        res.json(insertmodules);
    });

};

var getCurrentInsertModule = function(req, res) {

    req.config.collections.insertmodule.find({ "extid": req.params.id }, function(err, insertmod) {
        res.json(insertmod);
    });
};

var getCurrentTextInsertModule = function(req, res) {

    req.config.collections.insertmodule.findOne({ $and: [{ "extid": req.params.id }, { "type": "text" }] }, function(err, insertmod) {

        res.json(insertmod);
    });
};


var deleteInsertModule = function(req, res) {
    var id = req.params.id;
    req.config.collections.insertmodule.remove({ "extid": id }, function(err, eres) {
        res.json({});
    });
};

var getCurrentSelectedModule = function(req, res) {
    req.config.collections.insertmodule.findOne({ $and: [{ "extid": req.params.id }, { "index": req.params.index }] }, function(err, data) {
        res.json(data);
    });
};

var deleteModule = function(req, res) {
    console.log("req.params.id", req.params);
    req.config.collections.insertmodule.remove({ $and: [{ "extid": req.params.id }, { "index": req.params.index }] }, function(err, data) {
        res.json(data);
    });
};



/*************************************************/

exports.saveInsertModule = saveInsertModule;
exports.getInsertModule = getInsertModule;
exports.getCurrentInsertModule = getCurrentInsertModule;
exports.deleteInsertModule = deleteInsertModule;
exports.getCurrentSelectedModule = getCurrentSelectedModule;
exports.getCurrentTextInsertModule = getCurrentTextInsertModule;
exports.deleteModule = deleteModule;