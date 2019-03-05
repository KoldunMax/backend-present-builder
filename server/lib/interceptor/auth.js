var config = require('../../config/config.js');
var tokenapi = require("../../api/authenticate/token.js");
var requestIp = require('request-ip');
var device = require('express-device');


var customerdbpool = {};


var openRoutes = [{
        name: '/api/authenticate',
        method: 'POST'
    }, {
        name: '/api/authenticate/forgotpassword',
        method: 'POST'
    }, {
        name: '/api/authenticate/register',
        method: 'POST'
    }, {
        name: '/api/authenticate/verificationemail',
        method: 'POST'
    }, {
        name: '/api/authenticate/verify',
        method: 'POST'
    }, {
        name: '/api/documents/*',
        method: 'GET'
    }, {
        name: '/api/documents/pub/*',
        method: 'POST'
    }, {
        name: '/api/upload/*/*',
        method: 'GET'
    }, {
        name: '/api/frontend/*',
        method: 'GET'
    }, {
        name: '/api/frontend/*',
        method: 'POST'
    },
    {
        name: '/api/builder',
        method: 'POST'
    },
    {
        name: '/api/builder/download/*',
        method: 'GET'
    },
    {
        name: '/api/presentations/presentationcode/*',
        method: 'GET'

    },
    {
        name: '/api/users/*',
        method: 'POST'

    },
    {
        name: '/api/bitly/shorturl',
        method: 'POST'
    },
    {
        name: '/api/organizations/list',
        method: 'POST'
    },
    {
        name: '/api/organizations/activate',
        method: 'POST'
    },
    {
        name: '/api/users/userrole/*',
        method: 'GET'
    },
    {
        name: '/api/users',
        method: 'GET'
    },
    {
        name: '/api/plans',
        method: 'GET'
    },
    {
        name: '/api/plans',
        method: 'POST'
    },
    {
        name: '/api/groupmanagements',
        method: 'GET'
    },
    {
        name: '/api/groupmanagements',
        method: 'POST'
    },
     {
        name: '/api/users/delete',
        method: 'POST'
    },
    {
        name: '/api/users/activate',
        method: 'POST'
    },
     {
        name: '/api/organizations/*',
        method: 'GET'
    },
    {
        name: '/api/organizations',
        method: 'POST'
    },
    {
        name: '/api/plans/activate',
        method: 'POST'
    },
    {
        name: '/api/plans/active',
        method: 'GET'
    },
    {
        name: '/api/organizations/identifier/*',
        method: 'GET'
    },
    {
        name: '/api/insertmodule/*',
        method: 'GET'
    },
    {
        name: '/api/insertmodule/homepage/*',
        method: 'GET'
    }


];

var handleUserPass = function(username, password, req, res, next) {

    var users_db = req.config.collections.users;


    var q = { $or: [{ name: username.toLowerCase() }, { username: username.toLowerCase() }], password: password, active: true };

    users_db.findOne(q, function(err, user) {

        if (err || !user) {
            res.send({
                status: 'error',
                code: 403,
                message: "invalid credentials"
            });
            return;
        }

        req.session = {};
        req.session.user = user;
        req.orgid = user.orgid;
        next();

    });
};

var handleToken = function(token, req, res, next) {

    tokenapi.finduser(config, token, function(err, tokenRes) {

        if (err) {
            res.send({
                status: 'error',
                code: 403,
                message: err.message
            });
            return;
        }
        tokenapi.updatetoken(config, token, function() {});
        req.session = tokenRes.session;
        req.orgid = tokenRes.session.user.orgid;
        req.token = token;
        req.session.token = token;

        next();

    });

};

//similarly more..can be loaded from DB .. or parsed from specs file..using filereader.
module.exports = function(app) {


    //add middleware here
    app.use(requestIp.mw())

    //Express device capture
    app.set('view engine', 'ejs');
    app.set('view options', { layout: false });
    app.set('views', __dirname + '/views');

    app.use(device.capture());

    app.use(function(req, res, next) {


        req.ObjectID = config.ObjectID;
        req.config = config;
        req.config.push = app.push; //used for push notification..
        req.openroute = false;
        if (req.path.indexOf('/api/') != 0) {

            next();
            return;
        }


        var skip = false;

        for (var r = 0; r < openRoutes.length && !skip; r++) {
            var route = openRoutes[r];
            //console.log (route.name);
            if (route.method === req.method) {
                if (route.name === req.path) {

                    skip = true;
                    break;
                } else {
                    var parts = route.name.split("/");
                    var reqparts = req.path.split("/");
                    skip = true;
                    //console.log(parts);
                    //console.log(reqparts);
                    for (var i = 0; i < parts.length; i++) {
                        //  console.log ("matching -> " + parts[i] + " and " + reqparts[i]);
                        //if there is a * match at one place then say ok.
                        if (i < parts.length - 1 && parts[i] == reqparts[i] && parts[i + 1] == "*") {
                            skip = true;
                            //  console.log ("returnig true");
                            break;
                        }

                        if (parts[i] !== reqparts[i] && parts[i] !== "*" && skip) {
                            skip = false;
                            // console.log ("returnig false");
                            break;

                        }

                    }

                }
                //   console.log("skip ... " + skip);
            }

        }

        // if (skip) {
        //     next();
        //     return;
        // }



        var token = req.headers.token;
        if (!token) {
            token = req.query.token;
        }
        if (!token) {
            token = req.body.token;
        }

        try {
            config.ObjectID(token);
        } catch (e) {
            token = null;
        }

        if (token && req.path === '/api/logout') {

            tokenapi.deleteToken(req.config, token);
            res.send({
                status: 'error',
                code: 403,
                message: "successfully loggedout"
            });
            return;
        }

        if (token) {
            handleToken(token, req, res, next);
            return;

        } else {

            if (skip) {
                req.openroute = true;
                return next();
            }
            //lets try with user/pass
            var user = req.headers.username || req.query.username;
            var pass = req.headers.password || req.query.password;

            if (user && pass) {
                handleUserPass(user, pass, req, res, next);
                return;
            }

        }

        if (!token) {
            res.send({
                status: 'error',
                code: 403,
                message: 'missing authentication token'
            });
            return;
        }

        next();

    });
};