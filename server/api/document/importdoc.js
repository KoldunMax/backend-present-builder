var config = require ("../../config/config.js");
var imgRoot = "/Users/avanish/work/code/quick-locator/app-service/lib/user/pics";
var fs = require ("fs");
var docApi = require ("./document.controller.js");




var uploadUserPic = function (user){

	var data = {};
	data.contextid = user.socialid;
	data.doctype = "profile"; 
	data.contexttype = "user";
	data.size = 'normal';

	var src = imgRoot +"/" + user.socialid +".jpg";

	var mimetype = "application/octet-stream";
	var extension  = "jpg";

	if (!fs.existsSync (src)){
		return;
	}
	console.log ("** uploading ..." +user.socialid);
	
	docApi.uploadDoc (config, data, src, mimetype, extension, function (){});



};



var doUpload = function (){

	var profile = config.collections.profile;

	profile.find({}, function (err, users){

		console.log ("***found : "  + users.length);
		for (var i=0; i<users.length; i++){
			uploadUserPic (users[i]);
		}
	});

};


doUpload ();