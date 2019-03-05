'use strict';
var moment = require("moment");


/***find user based on token***/

exports.finduser = function(config, token, cb) {

    var session_db = config.collections.session;

    session_db.findOne({ _id: config.ObjectID(token) }, function(err, session) {

        if (err || !session) {
            cb({ status: 'error', message: 'invalid token' }, null);
            return;
        }

        if (moment(session.expires).isBefore(moment())) {
            //already expired .. 
            console.log("**********token expiry is before now");
            cb({
                status: 'error',
                message: 'token already expired'
            }, null);
            return;
        }

        if (!session.active) {
            console.log("Already logout");
            cb({
                status: 'error',
                message: 'Already logout'
            }, null);
            return;
        }

        cb(null, {
            status: 'ok',
            session: session
        });

    });

};



/*************** update token ***************/
exports.updatetoken = function(config, token, cb) {

    var session_db = config.collections.session;

    session_db.findOne({ _id: config.ObjectID(token) }, function(err, session) {
        if (err) {
            cb(err, session);
            return;
        }

        if (session.active) {
            session.expires = moment().add(config.sessiontime, 'minutes').toDate();
            session_db.save(session);
        }
        cb(null, session);

    });


};



/*************** create token ***************/
exports.createtoken = function(config, user, cb) {

    var session_db = config.collections.session;

    var session = {};
    console.log("in sessionjwdhxasbxds", user);
    session.user = user;
    session.created = new Date();
    session.expires = moment().add(config.sessiontime, 'minutes').toDate();
    session.active = true;


    session_db.save(session, function(err, session) {

        session.token = session._id.toString();
        cb(err, session);
    });


};



/***Delete token ***/
exports.deleteToken = function(config, token, cb) {

    var session_db = config.collections.session;


    session_db.findOne({ _id: config.ObjectID(token) }, function(err, session) {
        if (err) {
            cb(err, session);
            return;
        }

        if (session.active) {
            session.active = false;
            session_db.save(session);
        }
        if (cb) {
            cb(null, session);
        }


    });

};