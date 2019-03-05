'use strict';

var express = require('express');
var controller = require('./insertmodule.controller');

var router = express.Router();

router.post('/', controller.saveInsertModule);
router.get('/:id', controller.getInsertModule);
router.get('/currentmodules/:id', controller.getCurrentInsertModule);
router.get('/:id/:index', controller.getCurrentSelectedModule);
router.get('/homepage/:id/:type', controller.getCurrentTextInsertModule);
router.post('/delete/:id', controller.deleteInsertModule);
router.post('/delete/:id/:index', controller.deleteModule);

module.exports = router;