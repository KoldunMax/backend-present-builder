
var config = require("../../config/config.js");
var request = require("request");


var login = function (context, cb){

    var redirect_uri = config.gotomeeting.appurl+"/api/gotomeeting/auth";
    redirect_uri += "?token=" + context.token;

	var url = config.gotomeeting.apiurl + "/oauth/authorize?";
	url += "client_id=" + config.gotomeeting.consumerkey;
	url += "&redirect_uri="  + encodeURIComponent(redirect_uri);

	console.log ("sending url: " + url);
	return cb({url : url});
};


exports.login  = login;
