var config = require("../../config/config.js");

var sender = require("emailjs");
var fs = require("fs");
var async = require("async");
var https = require("https");
var emaildb = config.collections.emaillogs;
var removedb = config.collections.unsubscribed_emails;

//https.globalAgent.options.secureProtocol = 'SSLv3_method';

var sendTemplate = function(to, subject, templatename, model, cb) {
    //	to = "avakojha@gmail.com";

    //lets check whether this person is in removed list .

    removedb.findOne({ email: to }, function(err, removedemail) {
        if (removedemail) {
            console.log("attempted to send email to removed email " + to);
            cb(null, {});
            return;
        }

        var mailid = new config.ObjectId();
        var body = merge(templatename, model, mailid.toString());
        var txtBody = mergeText(templatename, model, mailid.toString());

        var unsub = unsubscribe(mailid.toString());
        body = body.replace(getKey("EMAIL"), to);
        txtBody = txtBody.replace(getKey("EMAIL"), to);
        //to = "web-PWUtIn@mail-tester.com";
        if (model.RECEIVER_NAME) {
            to = model.RECEIVER_NAME + "<" + to + ">";
        }

        var obj = {
            from: config.email.from,
            to: to,
            subject: subject,
            attachment: [{ data: body, alternative: true }]
        };
        //to = 'avakojha@gmail.com';

        sendemailWithUnsubscribe(to, subject, body, txtBody, unsub, function(
            err,
            res
        ) {
            obj.sendon = new Date();
            obj.err = err;
            obj.isread = false;
            obj._id = mailid;
            emaildb.save(obj, function(e, s) {
                //console.log (s);
                if (cb) {
                    cb(err, res);
                }
            });
        });
    });
};

var sendemailWithUnsubscribe = function(
    to,
    subject,
    body,
    txtBody,
    unsubscribe,
    cb
) {
    var server = sender.server.connect(config.email);
    var obj = {
        text: txtBody,
        from: config.email.from,
        to: to,
        subject: subject,

        attachment: [{ data: body, alternative: true }]
    };
    if (unsubscribe) {
        obj["List-Unsubscribe"] = unsubscribe;
    }

    server.send(obj, function(err, res) {
        if (err) {
            console.log("sendemailWithUnsubscribe", err);
        } else {
            console.log("sendemailWithUnsubscribe : email sent to ..." + obj.to);
        }
        if (cb) {
            cb(err, res);
        }
    });
};
var sendemail = function(emailData, cb) {
    var server = sender.server.connect(config.email);
    var obj = {
        from: config.email.from,
        to: emailData.to,
        subject: emailData.subject,
        attachment: [{ data: emailData.message, alternative: true }]
    };
    if (emailData.cc && emailData.cc.length > 0) {
        obj.cc = emailData.cc;
    }
    if (emailData.bcc && emailData.bcc.length > 0) {
        obj.bcc = emailData.bcc;
    }
    console.log(obj);
    server.send(obj, function(err, res) {
        if (err) {
            console.log(err);
        } else {
            console.log("email sent to ..." + obj.to);
        }
        if (cb) {
            return cb(err, res);
        }
    });
};

var getKey = function(x) {
    var key = "{{" + x + "}}";
    return new RegExp(key, "g");
};
var mergeText = function(templatename, model, mailid) {
    templatename = templatename.replace(".html", ".txt");
    var header = fs.readFileSync(__dirname + "/" + "./template/header.txt");
    var footer = fs.readFileSync(__dirname + "/" + "./template/footer.txt");

    var body = fs.readFileSync(__dirname + "/" + templatename, "utf8");
    body = header + body + footer; //combine all

    for (var prop in model) {
        body = body.replace(getKey(prop), model[prop]);
    }

    body = body.replace(getKey("SERVER"), server);
    body = body.replace(getKey("APP_NAME"), appname);

    body = body.replace(getKey("LOGO"), logolink(mailid));
    body = body.replace(getKey("UNSUBSCRIBE"), unsubscribe(mailid));

    return body;
};

var merge = function(templatename, model, mailid) {
    var header = fs.readFileSync(__dirname + "/" + "./template/header.html");
    var footer = fs.readFileSync(__dirname + "/" + "./template/footer.html");

    var body = fs.readFileSync(__dirname + "/" + templatename, "utf8");
    body = header + body + footer; //combine all

    for (var prop in model) {
        body = body.replace(getKey(prop), model[prop]);
    }

    body = body.replace(getKey("SERVER"), server);
    body = body.replace(getKey("APP_NAME"), appname);

    body = body.replace(getKey("LOGO"), logolink(mailid));
    body = body.replace(getKey("UNSUBSCRIBE"), unsubscribe(mailid));

    if (model.friends) {
        //body = body.replace (getKey ("FRIEND_PROFILE_PHOTOS"), friendSugestionList(model.friends));
    }

    //now cretae html
    body = "<html><body>" + body + "</body></html>";
    //console.log (body);
    return body;
};

var appname = "Presentation-Builder";
var server = "http://page-back.winscorewin.net";
//var server = "http://localhost:7000";

var asset = "/assets/images";

var logolink = function(mailid) {
    return (
        "<a href='" +
        server +
        "'><img width='50px' height='50px' alt='Presentation Builder' title='Presentation Builder' src='" +
        server +
        "/api/documents/pub/logo/" +
        mailid +
        "' /></a>"
    );
};

var unsubscribe = function(mailid) {
    return server + "/unsubscribe/" + mailid;
};

//*************** /
exports.sendemail = sendemail;
exports.server = server;
exports.merge = merge;
exports.sendTemplate = sendTemplate;

/*

var test = function (){
	sendemail ("avakojha@gmail.com", "testing", "some body", function (e){
		console.log (e);
	});
};
*/
//test ();