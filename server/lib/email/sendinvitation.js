var emailapi = require("./emailsender.js");

var send = function(meeting, cb) {

    var model = {};
    console.log("meeting", meeting, model);
    model.name = meeting.presentation.name;
    model.url = meeting.url;
    model.subject = meeting.subject;
    model.meetingdate = meeting.meetingstartdate;
    model.meetingtime = meeting.meetingstarttime;
    model.meetingduration = meeting.meetingduration;
    model.meetingtimezone = meeting.timezone;
    model.attendees = meeting.email;
    model.organizer = meeting.organizer;
    // console.log(JSON.stringify(model.attendees));

    model.html = "";
    model.attendees.forEach(function(attendee) {
        model.html += "<div> " + attendee + " </div>";
    }, this);

    emailapi.sendTemplate(meeting.email, model.subject, "template/meetingtemplate.html", model, function(err, res) {


        if (cb) {
            cb(err, res);
        }
    });

};
exports.send = send;