/*jslint node: true */



var activiyPermissions = require('./activitypermission.json');



module.exports = function(app) {

    'use strict';
    var _ = require('lodash');

    app.use(function(req, res, next) {

        if (req.path.indexOf('/api/') !== 0) {
            return next();
        }

        if (req.openroute) {

            return next();

        }
        req.session.isadmin = req.session.user.user_type === "admin";

        // if you are an admin => next ();
        if (req.session.isadmin) {
            return next();
        }

        //Activities Based Authorization
        var path = req.path;
        var module = req.path.split("/")[2];
        var routes = activiyPermissions[module];


        if (!routes) {
            console.log("Could not find module " + module + " while checking for authorization.");
            // return res.json({
            //     "status": "fail",
            //     "error": 401,
            //     "message": "You are not authorized."

            // });
            return next();
        }

        var skip = false;
        var permissions = req.session.user.user_permissions;


        for (var i = 0; i < routes.length; i++) {
            if (req.method === routes[i].verb) {

                var calcPath = "/api/" + module + routes[i].path;
                console.log("checking path :" + calcPath);
                for (var p in req.params) {

                    calcPath = calcPath.replace(":" + p, req.params[p]);
                }
                if (req.path === calcPath) {


                    // for (var j = 0; j < permissions.length; j++) {


                    //     if (_.indexOf(routes[i].permissions, permissions[j]) > -1) {

                    return next();
                    //     }

                    // }

                    if (!skip) {

                        req.logger.info("User is not authorized");
                        res.status(403);
                        return res.json({
                            "status": "fail",
                            "error": 403,
                            "message": "You are not authorized."

                        });
                    }

                }
            }

        }

        //if no route has been configured for permissions then allow the request.
        console.log("Could not find route " + req.path + " while checking for authorization.");
        return next();


    });
};