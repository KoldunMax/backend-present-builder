'use strict';

var _ = require('lodash');
var templateLib = require("../../lib/template/index.js");
var async = require('async');


// Save/Update template
var saveTemplate = function(req, res) {

    

    var template = {};
    var id = req.body._id;

    templateLib.saveTemp (req.config, req.body, req.orgid, id,function(data){
        return res.json(data);

    });

};


var deleteTemplate = function(req, res) {

    var id = req.params.id;

    templateLib.deleteTemp (req.config,id,function(e,r){
        return res.json({});

    });

};


var getTemplates = function(req,res){

    templateLib.getTemp(req.config,req.orgid,function(response){

         return res.json(response);

    });
};


var getTemplateById = function(req, res) {

    var id = req.params.id;

    templateLib.getTempById(req.config,req.orgid,id,function(template){
         return res.json(template);

    });
};


/*************************************************/

exports.getTemplateById = getTemplateById;
exports.saveTemplate = saveTemplate;
exports.getTemplates = getTemplates;
exports.deleteTemplate = deleteTemplate;

