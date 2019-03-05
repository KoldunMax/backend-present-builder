'use strict';

var express = require('express');
var controller = require('./authenticate.controller');

var router = express.Router();

router.post("/forgotpassword", controller.forgotpassword);
router.post('/', controller.authenticate);
router.post('/google/login', controller.googleAuth);
router.post('/google/calendar/token', controller.exchangeToken);

router.post('/google/calendar/agenda', controller.getGoogleCalenderAgenda);
router.get('/google/calendar/:year/:month', controller.getMonthly);


module.exports = router;