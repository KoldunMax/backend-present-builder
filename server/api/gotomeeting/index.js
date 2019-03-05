'use strict';

var express = require('express');
var controller = require('./gtm.controller');

var router = express.Router();
router.get('/auth', controller.auth);
router.get('/login', controller.login);
router.get('/isconnected', controller.isconnected);
router.get('/upcoming', controller.upcoming);
router.get('/historical', controller.historical);
router.get('/inprogress', controller.inprogress);
router.post('/delete/:id',controller.deleteScheduledMeeting);
router.post('/meetings', controller.createMeeting);
router.post('/sendmail', controller.sendMail);
module.exports = router;