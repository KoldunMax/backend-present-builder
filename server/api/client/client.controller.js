'use strict';

var _ = require('lodash');
var clientLib = require("../../lib/client/index.js");

var async = require('async');

// Save/Update client
var saveClient = function(req, res) {

    var client = {};
    var id = req.body._id;

    clientLib.saveClients(req.config,req.body,req.orgid,id,req.session, function(data){

         return res.json(data);

    });
    
};


var deleteClient = function(req, res) {

    var id = req.params.id;

    clientLib.deleteClients(req.config,req.orgid,id,req.session,function(err, eres){
        return res.json({});

    });
};


var getClients = function(req,res){

    clientLib.getClient(req.config,req.orgid,function(r){
        
          return res.json(r);
    });
};


var getClientById = function(req, res) {

    var id = req.params.id;
     
     clientLib.getClientById(req.config,req.orgid,id,function(data){
        
         return res.json(data);

     });
};

var isUniqueClient = function(req, res) {
   
     clientLib.uniqueClient(req.config, req.params, req.orgid, function(data){

           return res.json(data);

    });

};

/*************************************************/

exports.getClientById = getClientById;
exports.saveClient = saveClient;
exports.getClients = getClients;
exports.deleteClient = deleteClient;
exports.isUniqueClient = isUniqueClient;
