'use strict';
var _ = require('lodash');


// Get list of groupmanagements
var index = function(req, res) {
    var q = {};
    req.config.collections.groups.find(q, function(e, groups) {
        res.json(groups);
    });

};

var save = function(req, res) {

    var model = req.body;
    if (!model.name) {
        res.json({ error: 'Please provide name of group' });
        return;
    }
    //check this
    if (!model.userid) {
        //model.userid = req.session.user.userid;
    } else {
        model.userid = req.config.ObjectID(model.userid);
    }
    if (model._id) {
        model._id = req.config.ObjectID(model._id);
    }
    model.code = model.code.trim().replace(" ", "").toUpperCase();
    model.name = model.name;

    var q = { name: model.name };
    var orgid = req.orgid;

    req.config.collections.groups.findOne(q, function(e, z) {

        if (z) {
            // if (z.orgid !== orgid) {
            //     res.json({ error: 'This group is not owned by you' });
            //     return;
            // }
            z.code = model.code;
            z.name = model.name;
            z.active = model.active;
        } else {
            z = model;
            z.orgid = req.orgid;
        }
        if (model._id) {
            z._id = model._id;
            z.orgid = req.orgid;
        }

        req.config.collections.groups.save(z, function(e, group) {
            req.config.collections.groupitems.update({ groupid: group._id.toString(), orgid: orgid }, { $set: { group: group.name } }, { upsert: false, multi: true }, function(e, r) {
                res.json(group);
            });
        });
    });
};


var getgroupbytype = function(req, res) {
    console.log("res---->>",res);
    var db = req.clientdb;
    var type = req.params.type.toLowerCase();

    var codeset = req.config.collections.groupitems;
    var orgid = req.orgid;
    
    var q = {
        "lowertype": type
    };

    if (req.config.systemDefinedCodeSet.indexOf(type) < 0) {
        q.orgid = orgid;
    }

    codeset.find(q, function(err, model) {
        res.json(model);
    });
};


exports.delete = function(req, res) {

    req.config.collections.groups.remove({
        _id: req.config.ObjectID(req.body._id),
        orgid: req.orgid
    }, function(e, z) {
        req.config.collections.groupitems.remove({ groupid: req.body._id, orgid: req.orgid }, function(e, r) {
            res.json(r);
        });

    });
};

/* ******** Public methods ******** */


exports.getgroupbytype = getgroupbytype;
exports.save = save;
exports.index = index;