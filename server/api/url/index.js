'use strict';

var express = require('express');
var controller = require('./url.controller');

var router = express.Router();

router.post('/', controller.checkValidUrl);



/******************** Public Functions **************/
module.exports = router;