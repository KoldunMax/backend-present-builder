'use strict';

var express = require('express');
var controller = require('./organization.controller');

var router = express.Router();
router.get('/', controller.getAll);
router.get('/:id', controller.getOrgById);
router.post('/', controller.save);
router.get('/identifier/:name', controller.isUniqueorganization);
router.post('/list', controller.getOrganizationList);
router.post('/activate',controller.toggleActive); 
router.get('/data/:id', controller.getOrganizationData);



module.exports = router;