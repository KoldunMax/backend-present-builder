'use strict';

var _ = require('lodash');


// Get list of roles
var index = function(req, res) {

  var role = {};

    role.name = req.body.name;
       if (role.name === null || role.name.trim().length === 0) {
        res.json({ error: 'no role name provided' });
        console.log({ error: 'no role name provided' });
        return;
    }
    role.description = req.body.description;
    role.isactive = (req.body.isactive) ? req.body.isactive : true;
    role.orgid = req.orgid;
    role._id = req.body._id;
    if (role._id === null || role._id === 'undefined') {

        req.config.collections.role.save(role, function(err, role) {
            res.json(role);
        });

    } else {

        req.config.collections.role.save({

            "name": role.name,
            "description": role.description,
            "isactive": (role.isactive) ? role.isactive : true,
             "orgid" : role.orgid,
            "_id": req.config.ObjectId(role._id)
        }, function(err, role) {

            res.json(role);

        });

    }
};


var getRoles = function(req, res) {
    req.config.collections.role.find({}, function(err, contests) {
        res.json(contests);
    });
};



var removeRole = function(req, res) {

    var id = req.params.id;
    req.config.collections.role.remove({
        "_id": req.config.ObjectId(id)
    }, function(err, eres) {

        res.json({});

    });

};

var toggleActive = function(req, res) {

    req.config.collections.role.findOne({
        "_id": req.config.ObjectId(req.body.id),"orgid" : req.orgid
    }, function(err, role) {
        role.isactive = req.body.status;

        role.updatedon = new Date();

        req.config.collections.role.save(role, function(err, role) {
            res.json(role);
        });

    });

};

var editRole = function(req, res) {


    var id = req.params.id;

    req.config.collections.role.findOne({
        "_id": req.config.ObjectId(id)
    }, function(err, result) {

        res.json(result);

    });
};



/* ******** Public methods ******** */

exports.getRoles = getRoles;
exports.removeRole = removeRole;
exports.toggleActive = toggleActive;
exports.editRole = editRole;
exports.index = index;




