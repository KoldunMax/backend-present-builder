'use strict';

var express = require('express');
var controller = require('./role.controller');

var router = express.Router();

router.post('/', controller.index);
router.post('/remove/:id', controller.removeRole);
router.get('/:id', controller.editRole);
router.get('/', controller.getRoles);
router.post('/activate', controller.toggleActive);
module.exports = router;