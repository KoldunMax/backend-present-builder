'use strict';
var _ = require('lodash');
var email = require("../../lib/email/index.js");

var saveEmail = function(req, res) {
    email.saveEmail(req, function(e, r) {
        return res.json(r);
    });
};

var saveEmailTemplate = function(req, res) {
    email.saveTemplateEmail(req, function(e, r) {
        return res.json(r);
    });
};

var getEmailTemplates = function(req, res) {
    email.getAllTemplates(req, function(e, r) {
        return res.json(r);
    });
};

var getEmailData = function(req, res) {
    email.getEmailDataById(req, function(e, r) {
        return res.json(r);
    });
};

exports.saveEmail = saveEmail;
exports.getEmailData = getEmailData;
exports.saveEmailTemplate = saveEmailTemplate;
exports.getEmailTemplates = getEmailTemplates;