'use strict';

var express = require('express');
var controller = require('./builder.controller');

var router = express.Router(); 
router.post('/', controller.getPresentionByName); 
router.get('/download/:id', controller.download);
 

module.exports = router;