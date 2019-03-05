'use strict';

var express = require('express');
var controller = require('./recentactivity.controller');

var router = express.Router();

router.get('/', controller.getRecentActivity);




module.exports = router;