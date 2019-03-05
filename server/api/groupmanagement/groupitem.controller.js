'use strict';

var _ = require('lodash');

var getbygroupcode = function(req, res) {
    var orgid = req.orgid;

    var group_db = req.config.collections.groups;
    var itemdb = req.config.collections.groupitems;

    var grpQ = {
        code: req.params.code
    };

    //TODO : get organization specific codeset
    // if (req.config.systemDefinedCodeSet.indexOf(req.params.code) < 0) {
    //     grpQ.orgid = orgid;
    // }

    group_db.findOne(grpQ, function(e, grp) {

        if (!grp) {
            res.json([]);
            return;
        }
        itemdb.find({
            groupid: grp._id.toString(),
            active: true
        }, function(ex, items) {
            res.json(items);
        });
    });
};

// Get list of zoness
var index = function(req, res) {

    //console.log(req.params.groupid);
    var orgid = req.orgid;

    var q = {
        groupid: req.params.groupid
    };

    req.config.collections.groupitems.find(q, function(e, groupitems) {
        //console.log (records);
        res.json(groupitems);
    });

};

var save = function(req, res) {
    var model = {};
    var orgid = req.orgid;

    if (req.body._id) {
        model._id = req.config.ObjectID(req.body._id);
    } else {
        model.id = "nothing";
    }

    req.config.collections.groupitems.findOne({
        orgid: orgid,
        _id: model._id
    }, function(e, groupitem) {
        if (!groupitem) {
            groupitem = {};
            groupitem.created = new Date();
        }
        groupitem.groupid = req.body.groupid;
        groupitem.code = req.body.code.trim().replace(" ", "").toUpperCase();
        groupitem.name = req.body.name;
        groupitem.active = !!req.body.active;
        groupitem.orgid = req.orgid;
        req.config.collections.groupitems.save(groupitem, function(e, r) {
            res.json(r);
        });
    });
};

exports.delete = function(req, res) {

    var orgid = req.orgid;


    req.config.collections.groupitems.remove({
        orgid: orgid,
        _id: req.config.ObjectID(req.body._id)
    }, function(e, r) {
        res.json(r);
    });
};


/* ******** Public methods ******** */

exports.save = save;
exports.index = index;
exports.getbygroupcode = getbygroupcode;