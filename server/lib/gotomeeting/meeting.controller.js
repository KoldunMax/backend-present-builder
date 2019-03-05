var request = require("request");
var moment = require("moment");
var emailApi = require("../../lib/email/sendinvitation.js");
var _ = require('lodash');


var gtm = function(config, accessToken, path, cb) {
    var opts = {
        url: config.gotomeeting.apiurl + path,
        headers: {
            Authorization: accessToken
        },
        method: 'GET'
    };

    request(opts, function(e, r, b) {
        if (b) {
            b = JSON.parse(b);
        }
        return cb(e, b);
    });
};

//Call to external service
var gtmPost = function(config, accessToken, path, body, cb) {

    var url = config.gotomeeting.apiurl + path;

    var h = {};
    h["Content-Type"] = "application/json";
    h["Authorization"] = accessToken;

    request({
        url: url,
        method: 'POST',
        json: body,
        headers: h
    }, function(error, response, body) {

        //Parse string to JSON
        if (body && typeof(body) == "string") {
            body = JSON.parse(body);
        }

        cb(error, body);

    });
};



var upcoming = function(context, cb) {
    var userid = context.user.userid;

    var db = context.config.collections.gotomeeting;
    db.findOne({ userid: userid }, function(e, r) {
        if (e || !r) {
            return cb([]);
        }

        gtm(context.config, r.gtm.access_token, "/G2M/rest/upcomingMeetings", function(e, r) {
            if (e) {
                console.log(e);
                return cb([]);
            }
            var ans = [];
            for (var i = 0; i < r.length; i++) {
                if (r[i].status != 'ACTIVE') {
                    ans.push(r[i]);
                }
            }
            return cb(ans);
        });

    });
};

var createMeeting = function(context, cb) {
    console.log("context -----", context);
    var userid = context.user.userid;
    var db = context.config.collections.gotomeeting;

    var startDate = moment(context.body.meetingDate).format('MM/DD/YYYY');

    console.log(" 1  startDate ###### ", startDate);

    var startTime = moment(context.body.meetingTime).format("hh:mm:ss a");

    console.log(" 2  startTime ###### ", startTime);

    var meetingStartDateTime = new Date(startDate + " " + startTime);

    console.log(" 3  context.body.meetingDuration.code*1 ### ", context.body.meetingDuration.code * 1);

    var addedDateTime = moment(meetingStartDateTime).add(context.body.meetingDuration.code * 1, 'minutes');

    var meetingEndDateTime = new Date(addedDateTime);
    console.log(" 4  meetingEndDateTime ### ", meetingEndDateTime);

    db.findOne({ userid: userid }, function(e, r) {



        if (e || !r) {
            console.log("Ite print zala", e, r);
            return cb({});
        }
        var body = {
            "subject": context.body.meetingSubject,
            "starttime": meetingStartDateTime,
            "endtime": meetingEndDateTime,
            "passwordrequired": true,
            "conferencecallinfo": "Presentation meeting",
            "timezonekey": context.body.meetingTimeZone.code,
            "meetingtype": "immediate"
        };

        gtmPost(context.config, r.gtm.access_token, "/G2M/rest/meetings", body, function(e, r) {
            if (e) {
                console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@ ", e);
                return cb(e);
            }


            console.log("@@######### @ ", r);

            // send meeting invitation emails
            var data = {};
            data.email = _.pluck(context.body.recipients, 'email');
            data.url = r[0].joinURL;
            data.presentation = context.body.selectedPresentation;
            data.subject = context.body.meetingSubject;
            data.meetingstartdate = startDate;
            data.meetingstarttime = startTime;
            data.meetingduration = context.body.meetingDuration.name;
            data.organizer = context.user.email;
            data.timezone = context.body.meetingTimeZone.name;


            console.log("Sending email >> ", data);

            emailApi.send(data, function(error, response) {
                console.log("error, response", error, response);
                return cb(r);

            });


        });

    });

};

var inprogress = function(context, cb) {
    var userid = context.user.userid;

    var db = context.config.collections.gotomeeting;
    db.findOne({ userid: userid }, function(e, r) {
        if (e || !r) {
            return cb([]);
        }

        gtm(context.config, r.gtm.access_token, "/G2M/rest/upcomingMeetings", function(e, r) {
            if (e) {
                console.log(e);
                return cb([]);
            }

            var ans = [];
            for (var i = 0; i < r.length; i++) {
                if (r[i].status == 'ACTIVE') {
                    ans.push(r[i]);
                }
            }
            return cb(ans);


        });

    });
};




var historical = function(context, cb) {
    var userid = context.user.userid;

    var db = context.config.collections.gotomeeting;
    db.findOne({ userid: userid }, function(e, r) {
        if (e || !r) {
            return cb([]);
        }
        var url = "/G2M/rest/historicalMeetings";
        url += "?startDate=" + moment().subtract(1, 'months').format('YYYY-MM-DD') + "T00:00:00Z";

        url += "&endDate=" + moment().format('YYYY-MM-DD') + "T00:00:00Z";

        gtm(context.config, r.gtm.access_token, url, function(e, r) {
            if (e) {
                console.log(e);
                return cb([]);
            }

            return cb(r);
        });

    });
};


var sendMail = function(config, reqparams, reqbody, reqsession, cb) {

    var data = {};
    data.email = reqbody.email;
    data.url = reqbody.url;

    emailApi.send(data, function(error, response) {

        // mailActivitySave(config,reqbody,data,reqsession)

        return cb({ message: "Mail sent successfully" });

    });

};




exports.upcoming = upcoming;
exports.historical = historical;
exports.inprogress = inprogress;
exports.createMeeting = createMeeting;
exports.sendMail = sendMail;