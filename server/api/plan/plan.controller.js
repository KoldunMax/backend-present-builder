'use strict';

var _ = require('lodash');
var planLib = require("../../lib/plan/index.js");
var subscribeplanLib = require("../../lib/subscribeplan/index.js");



var async = require('async');

// Save/Update client
var savePlan = function(req, res) {
    planLib.savePlan(req, function(data) {
        return res.json(data);
    });
};

var deletePlan = function(req, res) {
    planLib.deletePlan(req, function(err, eres) {
        return res.json({});
    });
};


var getPlans = function(req, res) {

    planLib.getPlans(req, function(r) {

        return res.json(r);
    });
};


var getPlanById = function(req, res) {

    planLib.getPlanById(req, function(data) {

        return res.json(data);

    });
};
var subscribePlan = function(req, res) {

    subscribeplanLib.subscribePlan(req, function(data) {
        return res.json(data);
    });

};

var deleteSubscribePlan = function(req, res) {
    subscribeplanLib.deleteSubscribePlan(req, function(err, eres) {
        return res.json({});
    });
};


var getMyPlans = function(req, res) {

    subscribeplanLib.getMyPlan(req, function(r) {

        return res.json(r);
    });
};


var getSubscribePlanById = function(req, res) {

    subscribeplanLib.getSubscribePlanById(req, function(data) {

        return res.json(data);

    });
};

var toggleActive = function(req, res) {

    planLib.toggleActive(req, function(r) {

        return res.json(r);

    });
};



var getActivePlans = function(req, res) {

    planLib.getActivePlans(req, function(r) {

        return res.json(r);
    });
};

var getSubscribePlan = function(req,res){

     subscribeplanLib.getSubscribePlans(req, function(r) {

        return res.json(r);
    });

};

var getCurrentSubscribePlan = function(req,res){

     subscribeplanLib.getCurrentSubscribePlan(req, function(r) {

        return res.json(r);
    });

};

var getPlanHistory = function(req,res){

     subscribeplanLib.getPlanHistory(req, function(r) {

        return res.json(r);
    });

};


/*************************************************/

exports.getPlanById = getPlanById;
exports.savePlan = savePlan;
exports.getPlans = getPlans;
exports.deletePlan = deletePlan;
exports.getSubscribePlanById = getSubscribePlanById;
exports.subscribePlan = subscribePlan;
exports.getMyPlans = getMyPlans;
exports.deleteSubscribePlan = deleteSubscribePlan;
exports.toggleActive = toggleActive;
exports.getActivePlans =getActivePlans;
exports.getSubscribePlan = getSubscribePlan;
exports.getCurrentSubscribePlan = getCurrentSubscribePlan;
exports.getPlanHistory = getPlanHistory;