'use strict';

var _ = require('lodash');

// Get list of zoness
var update = function(req, res) {

    var user = req.body.username;
    var pass = req.body.password;

    var all = req.body.all;
    var ids = req.body.groupitems;
    var ip = req.body.ip;


};


var myip = function(req, res) {
    res.json({ ip: req.connection.remoteAddress })
};


/* ******** Public methods ******** */


exports.update = update;
exports.myip = myip;
