'use strict';

var _ = require('lodash');
var tokenapi = require("./token.js");
var forgotpassapi = require("../../lib/user/passwordapi.js");
var utilApi = require("../../lib/util/coreutil.js");
var oauth = require("../../lib/googleapi/index");

var authenticate = function(req, res) {

    var username = req.body.username;
    var password = req.body.password;

    if (!username || !password) {
        //res.status (401);
        return res.json({ "errorcode": -1, error: 'username/password is missing' });
    }

    if (req.headers.usertype && req.headers.usertype == "admin") {
        return authenticateAdmin(req, res);
    }

    var db = req.config.collections.users;

    var q = { username: username.toLowerCase(), deleted: false };

    db.findOne(q, function(err, user) {

        var u = user;

        if (err || !user) {
            //res.status (401);
            return res.json({
                "error": "you have not signed up.",
                "errorcode": 1000
            });

        }

        if (!user.active) {
            return res.json({
                "error": "Your account has been disabled.",
                "errorcode": 1011
            });
        }

        var p = utilApi.hash(password);

        if (u.password != p) {
            //res.status (401);
            return res.json({
                "error": "invalid password.",
                "errorcode": 1010
            });

        }

        tokenapi.createtoken(req.config, {
            userid: user._id,
            username: user.username,
            orgid: user.orgid,
            role: user.role,
            email: user.email
        }, function(err, session) {
            var result = {
                userid: user._id,
                username: user.username,
                displayname: user.name || user.username,
                email: user.username,
                token: session.token,
                firstname: user.firstname || user.username,
                lastname: user.lastname || "",
                admin: true,
                organization: user.orgid
            };
            result.role = user.role;

            return res.json(result);

        });

    });

};





var forgotpassword = function(req, res) {

    forgotpassapi.forgotpassword(req.config, req.body.username, function(err, r) {

        return res.json(r);
    });

};


var authenticateAdmin = function(req, res) {

    var db = req.config.collections.users;
    var username = req.body.username;
    var password = req.body.password;

    //var p = utilApi.hash(password);
    //TODO : check for passwaord after adding default admin use for admin portal
    var q = { "username": username.toLowerCase() }; //"password": password

    db.findOne(q, function(err, user) {

        if (!user) {
            return res.json({
                "error": "invalid username/password.",
                "errorcode": 1011
            });
        }

        //TODO : Currently check hardcoded password
        if (password == "Quick123") {
            tokenapi.createtoken(req.config, {
                userid: user._id,
                username: user.username,
                orgid: user.orgid,
                role: user.role
            }, function(err, session) {
                var result = {
                    userid: user._id,
                    username: user.username,
                    displayname: user.name || user.username,
                    email: user.username,
                    token: session.token,
                    firstname: user.firstname || user.username,
                    lastname: user.lastname || "",
                    admin: true,
                    organization: ""
                };
                result.role = "admin"; //user.assignrole ? user.assignrole.name : [];
                return res.json(result);
            });

        } else {
            return res.json({
                "error": "invalid username/password.",
                "errorcode": 1011
            });

        }
    });

};

var googleAuth = function(req, res) {

    var redirecturl = req.body.redirecturl;
    
    oauth.getLogin(req, redirecturl, req.body.reconnect, function(err, resp) {

        return res.json(resp);

    });

};

var getGoogleCalenderAgenda = function(req, res) {

   

    oauth.getGoogleCalenderAgenda(req,  function(err, resp) {

        return res.json(resp);

    });

};



var getMonthly = function (req, res){ 
        oauth.getMonthCalendar (req.config, req.session.user, req.params.month, req.params.year,  function(r){
            res.json (r);
        });
};


var exchangeToken = function (req, res){
    var code = req.body.code;
    
        var redirecturl = req.body.redirecturl;
    
    oauth.exchangeToken (req,  redirecturl, code,  function(r){
        res.json (r);
    });
};

/* ******** Public methods ******** */
exports.forgotpassword = forgotpassword;
exports.authenticate = authenticate;
exports.googleAuth = googleAuth;
exports.getGoogleCalenderAgenda = getGoogleCalenderAgenda;
exports.getMonthly = getMonthly;
exports.exchangeToken = exchangeToken;