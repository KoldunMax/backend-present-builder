'use strict';

var express = require('express');
var controller = require('./menu.controller');

var router = express.Router();

router.post('/', controller.saveMenu);
router.get('/', controller.getMenus);
router.post('/delete/:id', controller.deleteMenu);
router.get('/:id', controller.getPresentationById);
router.get('/menu/:presentid', controller.getMenuByPresentationid);

module.exports = router;