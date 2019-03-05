var async = require("async");
var config = require("../../config/config.js");
var core = require("../../config/core.js");
var email = require("../email/emailsender.js");

/**
 * [doCronTask  function does cron job required to execute the task]
 * @return callback 
 */
var doCronTask = function(cb) {
    var today = new Date();

    config.collections.email_queue.find({
            status: "pending",
            sendbydate: {
                $lt: today
            }
        },
        function(err, emailqueue) {
            if (err) {
                return cb(err, null);
            }

            sendEmail(emailqueue, function(er, response) {
                console.log(response);
            });
        }
    );
};

var sendEmail = function(emailqueue, cb) {
    async.eachSeries(
        emailqueue,
        function(e, callback) {
            email.sendemail(e, function(err, emailRes) {
                updateStatus(e, function() {
                    return callback();
                });
            });
        },
        function() {
            return cb(null, {
                status: "success",
                message: "email sent successfully"
            });
        }
    );
};

var updateStatus = function(email, cb) {
    config.collections.email_queue.update({ _id: config.ObjectID(email._id) }, { $set: { status: "sent" } },
        function(err, response) {
            return cb({ status: "success", message: "status updated successfully" });
        }
    );
};

doCronTask(function(err, response) {
    if (err || !response) {
        console.log("err", err);
    } else {
        console.log("response -- ", response);
    }
});