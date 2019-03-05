'use strict';

var express = require('express');
var controller = require('./email.controller');

var router = express.Router();
router.post('/', controller.saveEmail);
router.post('/template', controller.saveEmailTemplate);
router.get('/templates', controller.getEmailTemplates);
router.get('/:id', controller.getEmailData);


module.exports = router;