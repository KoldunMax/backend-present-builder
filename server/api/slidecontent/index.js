'use strict';

var express = require('express');
var controller = require('./slidecontent.controller');

var router = express.Router();

router.post('/', controller.saveSlideContent);
router.post('/:slideid', controller.deleteContents);
router.get('/:id/:data', controller.getSlideContentData);
router.get('/:id', controller.getSlideContent);
router.get('/slide/:slideid', controller.getSlideContentBySlideId);
router.get('/:presentid/slide/contents', controller.getSlideContentByPresentId);
router.post('/remove/:id', controller.remove);
router.post('/remove/:id/:data', controller.removeSlide);
router.post('/sequence', controller.sequence);
router.get('/slide/:slideid/:index', controller.getSlideSelectedContentData);
router.post('/delete/content/:slideid/:index', controller.deleteSlideContent);


module.exports = router;