'use strict';

var express = require('express');
var controller = require('./template.controller');

var router = express.Router();

router.post('/', controller.saveTemplate);
router.get('/', controller.getTemplates);
router.post('/delete/:id', controller.deleteTemplate);
router.get('/:id', controller.getTemplateById);

module.exports = router;