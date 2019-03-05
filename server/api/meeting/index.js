'use strict';

var express = require('express');
var controller = require('./meeting.controller');

var router = express.Router();

router.post('/', controller.saveMeeting);

module.exports = router;