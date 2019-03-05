'use strict';

var _ = require('lodash');



 var saveContact = function(req,res){
    var cont  = {};
     if (typeof id !== 'undefined') {
        cont._id = config.ObjectID(id);
        cont.updatedon = reqbody.createdon;
        cont.type = "updated";
    } else {
        cont.createdon = new Date();
        cont.updatedon = new Date();
        cont.type = "created";
    }
      cont = req.body;
      req.config.collections.contact.save(cont, function(err, contact) {
            res.json(contact);
        });

 };


 var getContactByClient = function(req,res){
 
    req.config.collections.contact.find({"clientid" : req.params.clientid}, function(err, contacts) {
        res.json(contacts);
    });

 };

 
var removeContact = function(req, res) {

    var id = req.params.id;
    req.config.collections.contact.remove({"_id": req.config.ObjectId(id)}, function(err, eres) {

        res.json({});

    });

};


 exports.saveContact = saveContact;
 exports.getContactByClient = getContactByClient;
 exports.removeContact = removeContact;



