'use strict';

var _ = require('lodash');

var emailLib = require("../../lib/emailsetting/index.js");

var getAll = function(req, res) {

	req.config.collections.emailsetting.find ({}, function (e, r){

		  res.json(r);
	});


};

var save = function (req, res){
	var emailsetting = req.body;

	emailLib.saveEmail(req.config,emailsetting,function(e,r){
		return res.json(r);

	});
};

exports.save = save;
exports.getAll = getAll;