var _ = require("lodash");
var moment = require("moment");

var saveEmail = function(req, cb) {
    var data = {};
    if (req.body.type == "schedule") {
        data = getFormattedScheduleData(req);
    } else {
        data = getFormattedData(req);
    }
    req.config.collections.email_queue.save(data, function(err, resp) {
        if (err) {
            return cb(err, null);
        }
        return cb(null, { status: "success", message: "email sent successfully " });
    });
};

var getFormattedData = function(req) {
    console.log(req.body);
    var data = req.body;
    var formattedData = {};
    formattedData.to = data.recipient.map(c => c.name + " <" + c.email + ">");
    formattedData.cc = data.cc ?
        data.cc.map(c => c.name + " <" + c.email + ">") :
        [];
    formattedData.bcc = data.bcc ?
        data.bcc.map(c => c.name + " <" + c.email + ">") :
        [];
    formattedData.subject = data.subject ? data.subject : "";
    formattedData.message = data.message ? data.message : "";
    formattedData.status = "pending";
    formattedData.createdon = new Date();
    formattedData.senton = new Date();
    formattedData.sendbydate = new Date();
    formattedData.presentationid = data.presentation[0]._id;
    formattedData.from =
        req.session.user.username + " <" + req.session.user.email + ">";
    return formattedData;
};

var getFormattedScheduleData = function(req) {
    var data = req.body;
    var formattedData = {};
    formattedData.to = data.recipient.map(c => c.name + " <" + c.email + ">");
    formattedData.cc = data.cc ?
        data.cc.map(c => c.name + " <" + c.email + ">") :
        [];
    formattedData.bcc = data.bcc ?
        data.bcc.map(c => c.name + " <" + c.email + ">") :
        [];
    formattedData.subject = data.subject ? data.subject : "";
    formattedData.message = data.message ? data.message : "";
    formattedData.status = "pending";
    formattedData.createdon = new Date();
    formattedData.senton = new Date();
    formattedData.sendbydate = data.customdate ?
        data.customdate :
        moment()
        .add(1, "days")
        .toISOString();
    formattedData.sendbytime = getTime(data);
    formattedData.timezone = data.timezone;
    formattedData.presentationid = data.presentation[0]._id;
    formattedData.from =
        req.session.user.username + " <" + req.session.user.email + ">";
    return formattedData;
};

var getTime = function(data) {
    return data.customtime ?
        data.customtime :
        data.tomorowmorning ? data.tomorowmorning : data.tomorrowafternon;
};

var saveTemplateEmail = function(req, cb) {
    var data = getFormattedTemplateData(req);
    req.config.collections.emailtemplates.save(data, function(err, resp) {
        if (err) {
            return cb(err, null);
        }
        return cb(null, {
            status: "success",
            message: "Template Saved Successfully"
        });
    });
};

var getFormattedTemplateData = function(req) {
    var data = req.body;
    var formattedData = {};
    formattedData.name = data.subject ? data.subject : "";
    formattedData.subject = data.subject ? data.subject : "";
    formattedData.message = data.message ? data.message : "";
    formattedData.createdon = new Date();
    formattedData.createdby = req.session.user.username;
    return formattedData;
};

var getAllTemplates = function(req, cb) {
    req.config.collections.emailtemplates.find({}, function(err, templates) {
        if (err) {
            return cb(err, null);
        }
        return cb(null, templates);
    });
};

var getEmailDataById = function(req, cb) {
    req.config.collections.email_queue.find({ presentationid: req.params.id },
        function(err, queue) {
            if (err) {
                return cb(err, null);
            }
            return cb(null, queue);
        }
    );
};

exports.saveEmail = saveEmail;
exports.saveTemplateEmail = saveTemplateEmail;
exports.getAllTemplates = getAllTemplates;
exports.getEmailDataById = getEmailDataById;