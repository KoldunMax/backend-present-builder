'use strict';
var menuLib = require('../../lib/menu/index.js');

var _ = require('lodash');

var async = require('async');


var saveMenu = function(req, res) {

    var menu = req.body;

    menuLib.saveMenuDetails(req.config, menu, req.session, function(data) {

        return res.json(data);

    });

};


var getMenus = function(req, res) {

    req.config.collections.menus.find({}, function(err, menu) {

        return res.json(menu);
    });
};


var deleteMenu = function(req, res) {

    var id = req.params.id;

    mreq.config.collections.menus.remove({ "_id": req.config.ObjectID(id) }, function(err, eres) {
        return res.json({});
    });

};


var getPresentationById = function(req, res) {

    req.config.collections.menus.findOne({ "_id": req.config.ObjectID(req.params.id) }, function(err, present) {

        return res.json(present);

    });

};
var getMenuByPresentationid = function(req, res) {

    req.config.collections.menus.findOne({ "presentid": req.params.presentid.toString() }, function(err, menu) {

        return res.json(menu);

    });

};



/*************************************************/

exports.saveMenu = saveMenu;
exports.getMenus = getMenus;
exports.getPresentationById = getPresentationById
exports.deleteMenu = deleteMenu;
exports.getMenuByPresentationid = getMenuByPresentationid;