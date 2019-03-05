'use strict';

var express = require('express');
var controller = require('./slide.controller');

var router = express.Router();

router.post('/', controller.saveSlide);
router.get('/:id', controller.getSlide);
router.post('/delete/:id', controller.deleteSlide);
router.post('/url', controller.getSlideUrl);
router.post('/saveSequence', controller.saveSequence);
router.post('/copy/slide', controller.copySlide);
//router.get('/:id', controller.getPresentationById);

module.exports = router;