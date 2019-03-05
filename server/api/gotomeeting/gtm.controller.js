'use strict';
var _ = require('lodash');
var lib = require("../../lib/gotomeeting");
//https://developer.citrixonline.com/content/gotomeeting-api-reference


var login = function (req, res){

	//https://api.citrixonline.com/oauth/authorize?client_id={consumerKey}&redirect_uri=http%3A%2F%2Fcode.example.com%26state%3DMyTest
    lib.login (req.session, function (r){
        return res.json (r);
    }); 
	 
	


};



 //getGTMAccessToken('1574cf0d','Hpk3urX5phoYcKgKX8Ina3FrFZHOuLDT');

var auth = function(req, res) {
    
    var context = req.session; 
    context.body = req.body;
    context.query = req.query;
    context.config = req.config;

    lib.auth (context, function (r){
        if (r.status != 'error'){
           return  res.redirect ("/video-conference");
        }
        return res.redirect ("/video-conference?err=" + r.err.ErrorCode);
    });
    
   // getGTMAccessToken(req.body.code,config.gotomeeting.consumerkey);
    
    
};

var isconnected = function (req, res){
    var db = req.config.collections.gotomeeting;
    
    var userid = req.session.user.userid;
    var  q = {userid: userid}; 
    db.findOne(q, function (e, r){ 
        if (e || !r || !r.gtm.access_token){
            return res.json ({result : false});
        }

         return res.json ({result : true});
    });
};

var upcoming = function (req, res){
    var context = req.session;
    context.config   = req.config;

    lib.upcoming (context, function (r){
        return res.json (r);
    });
};

var createMeeting = function (req, res){
    var context = req.session;
    context.config   = req.config;
    context.body = req.body;

    lib.createMeeting (context, function (r){
        console.log("meetingdeatil",r);
        return res.json (r);
    });
};

var sendMail = function(req, res) {

    lib.sendMail(req.config, req.params, req.body, req.session, function(err, meeting) {

        return res.json({ message: "Mail sent successfully" });

    });
};


var historical = function (req, res){
    var context = req.session;
    context.config   = req.config;

    lib.historical (context, function (r){
        return res.json (r);
    });
};



var inprogress = function (req, res){
    var context = req.session;
    context.config   = req.config;

    lib.inprogress (context, function (r){
        return res.json (r);
    });
};

var deleteScheduledMeeting = function(req,res){
    console.log("req.params",req.params.id)
    // var db = req.config.collections.gotomeeting;
    // db.remove(req.params.id, function (e, r){ 
    //   return res.json(r);
    // });
};

exports.login = login;
exports.auth = auth;
exports.isconnected = isconnected; 
exports.upcoming = upcoming;
exports.historical = historical;
exports.inprogress  = inprogress;
exports.deleteScheduledMeeting = deleteScheduledMeeting;
exports.createMeeting  = createMeeting;
exports.sendMail = sendMail;

