var emailapi = require("./emailsender.js");

var send = function(present, cb) {
    
    var model = {};
    model.presentname = present.present.name;
    model.url = present.url;
    emailapi.sendTemplate(present.email, "Presentation Information", "./template/urltemplate.html", model, function(err, res) {

        if (cb) {
            cb(err, res);
        }
    });

};


exports.send = send;
