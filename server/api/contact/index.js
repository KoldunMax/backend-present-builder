'use strict';

var express = require('express');
var controller = require('./contact.controller');

var router = express.Router();

router.post('/', controller.saveContact);
router.get('/:clientid', controller.getContactByClient);
router.post('/remove/:id', controller.removeContact);

module.exports = router;