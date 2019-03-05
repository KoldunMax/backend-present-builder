
var authController = require("./auth.controller.js");
var loginController = require ("./login.controller.js");
var meetingController = require ("./meeting.controller.js");


exports.auth = authController.auth;
exports.login = loginController.login;
exports.upcoming = meetingController.upcoming;
exports.historical  = meetingController.historical;
exports.inprogress = meetingController.inprogress;
exports.createMeeting = meetingController.createMeeting;