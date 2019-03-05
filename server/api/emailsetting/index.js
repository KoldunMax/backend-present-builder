'use strict';

var express = require('express');
var controller = require('./emailsetting.controller');

var router = express.Router();
router.get('/', controller.getAll);
router.post('/', controller.save);


module.exports = router;

