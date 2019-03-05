var request = require("request");
var async = require('async');

var saveClients = function(config, reqbody, reqorgid, id, reqsession, cb) {

    console.log("in main save function");
   
    var client = {};
    if (typeof id !== 'undefined') {
        client._id = config.ObjectID(id);
        client.updatedon = reqbody.createdon;
        client.type = "updated";
    } else {
        client.createdon = new Date();
        client.updatedon = new Date();
        client.type = "created";
    }

    // client.name = reqbody.name.toLowerCase();
    // client.identifier = reqbody.identifier.toLowerCase();
    // client.description = reqbody.description;
    // client.email = reqbody.email;
    // client.phone = reqbody.phone;
    // client.fax = reqbody.fax;
    // client.web = reqbody.web;
    // client.job = reqbody.job;
    // client.depart = reqbody.depart;
    // client.primary_contact = reqbody.primary_contact;
    // client.mobile = reqbody.mobile;
    // client.billing_contact = reqbody.billing_contact;
    // client.additional_contact = reqbody.additional_contact;
    // client.addressone = reqbody.addressone;
    // client.addresstwo = reqbody.addresstwo;
    // client.city = reqbody.city;
    // client.state = reqbody.state;
    // client.zip = reqbody.zip;
    // client.contacts = reqbody.contacts;
    client.isactive = (reqbody.isactive) ? reqbody.isactive : false;
    client.orgid = reqorgid;
    client.name = reqbody.name;
    client.identifier = reqbody.identifier ? reqbody.identifier.toLowerCase() : reqbody.name.toLowerCase();
    client.employee = reqbody.employee;
    client.address = reqbody.address;
    client.city = reqbody.city;
    client.state = reqbody.state;
    client.zipcode = reqbody.zipcode;
    client.mainphoneno = reqbody.mainphoneno;
    client.webaddress = reqbody.webaddress;
    client.description = reqbody.description;
  

    config.collections.clients.save(client, function(err, response) {
        saveClientRecentActivity(config, reqbody, client, reqsession);
        return cb(response);

    });
};

var saveClientRecentActivity = function(config, reqbody, client, reqsession) {
    var saveClientRecentActivity = {};
    saveClientRecentActivity.objecttype = "Client";
    saveClientRecentActivity.type = client.type;
    saveClientRecentActivity.activity_date = new Date();
    saveClientRecentActivity.activity_name = client.name;
    saveClientRecentActivity.activity_by = reqsession.user.username;
    saveClientRecentActivity.user_id = reqsession.user.userid;
    config.collections.recentactivity.save(saveClientRecentActivity, function(err, response) {

    });
};

var deleteClients = function(config, reqorgid, id, reqsession, cb) {
    deleteClientActivity(config, reqorgid, id, reqsession);
    config.collections.clients.remove({ "_id": config.ObjectID(id), "orgid": reqorgid }, function(err, eres) {
        return cb({ 'status': 'success', 'message': 'Deleted slide successfully' });
    });

};

var deleteClientActivity = function(config, reqorgid, id, reqsession) {
    config.collections.clients.findOne({ "_id": config.ObjectID(id), "orgid": reqorgid }, function(err, client) {
        var deleteClient = {};
        deleteClient.objecttype = "Client";
        deleteClient.type = "deleted";
        deleteClient.activity_date = new Date();
        deleteClient.activity_name = client.name;
        deleteClient.activity_by = reqsession.user.username;
        deleteClient.user_id = reqsession.user.userid;
        config.collections.recentactivity.save(deleteClient, function(err, response) {

        });
    });
};



var getClient = function(config, reqorgid, cb) {

    config.collections.clients.find({ "orgid": reqorgid }).sort({ $natural: -1 }, function(err, response) {
        //Get recent activity for each client
        async.eachSeries(response, function(client, callback) {
            config.collections.recentactivity.find({ "client_id": client._id.toString(), "org_id": client.orgid.toString() }).sort({ activity_date: -1 }).limit(1, function(err, activity) {
                client.recent_activity = (activity && activity.length > 0) ? activity[0] : {};

                 config.collections.contact.find({ "clientid": client._id.toString() }, function(err, contacts) {
                     client.contact = contacts[0];
                    
                    return callback();
                 });
            });
        }, function() {
            return cb(response);
        });
    });
};

var getClientById = function(config, reqorgid, id, cb) {
    config.collections.clients.findOne({ "_id": config.ObjectID(id), "orgid": reqorgid }, function(err, client) {
        return cb(client);

    });
};

var uniqueClient = function(config, ident, reqorgid, cb) {
    var data = { "isUniqueClient": false };
    config.collections.clients.findOne({ "identifier": ident.name, "orgid": reqorgid }, function(err, identifier) {
        if (identifier) {
            data.isUniqueClient = true;
        }
        return cb(data);

    });
};


exports.saveClients = saveClients;
exports.deleteClients = deleteClients;
exports.getClient = getClient;
exports.getClientById = getClientById;
exports.uniqueClient = uniqueClient;