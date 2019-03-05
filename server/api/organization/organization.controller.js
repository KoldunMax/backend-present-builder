'use strict';
var orgLib = require('../../lib/organization/index.js');

var _ = require('lodash');

var getAll = function(req, res) {

    req.config.collections.organization.findOne({ "_id": req.ObjectID(req.session.user.orgid.toString()) }, function(e, r) {
        res.json(r);
    });


};

var getOrganizationList = function(req, res) {
    orgLib.getOrgList(req.config, function(r) {
        res.json(r);
    });
};


var getOrgById = function(req, res) {

    req.config.collections.organization.findOne({ "_id": req.ObjectID(req.params.id) }, function(e, r) {

        res.json(r);
    });


};

var save = function(req, res) {
    var org = req.body;

    orgLib.saveOrgData(req.config, org, function(data) {
        return res.json(data);
    });


};
var toggleActive = function(req, res) {

    req.config.collections.organization.findOne({ "_id": req.config.ObjectId(req.body.id) }, function(err, org) {
        org.active = req.body.status;
        org.updated = new Date();


        req.config.collections.organization.save(org, function(err, org) {
            res.json({ status: "ok" });
        });

    });
};

var isUniqueorganization = function(req, res) {
    var data = { "isUniqueorganization": false };

    req.config.collections.organization.findOne({ "identifier": req.params.name }, function(err, identifier) {

        if (identifier) {

            data.isUniqueorganization = true;
        }
        data.organization = identifier;
        return res.json(data);
    });
};
var getOrganizationData = function(req,res){
     req.config.collections.organization.findOne({ "_id": req.ObjectID(req.session.user.orgid.toString()) }, function(e, r) {

        return res.json(r);
    });  
};
// ================================================

exports.save = save;
exports.getAll = getAll;
exports.getOrgById = getOrgById;
exports.isUniqueorganization = isUniqueorganization;
exports.getOrganizationList = getOrganizationList;
exports.toggleActive = toggleActive;
exports.getOrganizationData = getOrganizationData;