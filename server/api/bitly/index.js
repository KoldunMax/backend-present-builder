'use strict';

var express = require('express');
var controller = require('./bitly.controller');

var router = express.Router();

router.post('/shorturl', controller.shorten);
router.post('/shortimageurl', controller.shortenImageUrl);


/******************** Public Functions **************/
module.exports = router;