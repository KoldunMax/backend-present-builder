'use strict';

var _ = require('lodash');

var async = require('async');

// Save/Update client
var saveMeeting = function(req, res) {
  var meetings = req.body;
  req.config.collections.meetings.save(meetings, function(err, response) {
        return res.json(response);
  });
};



/*************************************************/


exports.saveMeeting = saveMeeting;
