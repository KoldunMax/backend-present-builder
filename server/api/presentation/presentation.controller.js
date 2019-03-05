"use strict";

var _ = require("lodash");
var requestIp = require("request-ip");
var useragent = require("useragent");

var async = require("async");
var presentationLib = require("../../lib/presentation/index.js");
var emailApi = require("../../lib/email/sendurl.js");
var bitly = require("../../lib/bitly/index.js");

// Save/Update presentation
var savePresentation = function(req, res) {
    var present = req.body;
    presentationLib.savePresentationDetails(
        req.config,
        present,
        req.orgid,
        req.session,
        function(data) {
            return res.json(data);
        }
    );
};

var getPresentations = function(req, res) {
    presentationLib.getPresentationData(req, function(data) {
        return res.json(data);
    });
};
//toggle
var toggleActive = function(req, res) {
    presentationLib.toggle(req.config, req.body, req.orgid, function(presentres) {
        return res.json(presentres);
    });
};

//get by id
var getPresentationById = function(req, res) {
    var id = req.params.id;

    presentationLib.getPresentById(req.config, id, req.orgid, function(present) {
        return res.json(present);
    });
};

var deletePresentation = function(req, res) {
    presentationLib.deletePresentation(
        req.config,
        req.orgid,
        req.params.id,
        function(e, r) {
            return res.json(r);
        }
    );
};

//copy
var copyPresentation = function(req, res) {
    presentationLib.copy(req.config, req.body, req.session, function(
        err,
        response
    ) {
        return res.json({ status: "success", data: response });
    });
};
// get bu client id
var getPresentationByClientId = function(req, res) {
    presentationLib.getPresentByClientId(
        req.config,
        req.params,
        req.orgid,
        function(presents) {
            return res.json(presents);
        }
    );
};

//get url
var getPresentationUrl = function(req, res) {
    presentationLib.getUrl(req.config, req.body, req.session, function(data) {
        return res.json(data);
    });
};

var getPresentationsUrl = function(req, res) {
    var urls = [];
    async.eachSeries(
        req.body,
        function(presentation, callback) {
            presentationLib.getUrl(req.config, presentation, req.session, function(
                data
            ) {
                urls.push(data);
                callback();
            });
        },
        function(e, r) {
            return res.json(urls);
        }
    );
};

//get code
var getPresentationCode = function(req, res) {
    presentationLib.getCode(req.config, req.params, function(presentation) {
        return res.json(presentation);
    });
};

// get slide
var getSlides = function(req, res) {
    presentationLib.getSlide(req.config, req.orgid, req.params, function(slides) {
        return res.json(slides);
    });
};

var saveUserDetails = function(req, res) {
    var userDetail = {};
    var agent = useragent.parse(req.headers["user-agent"]);
    var clientIp = requestIp.getClientIp(req);

    userDetail.ip = clientIp;
    userDetail.browser = agent.toAgent();
    userDetail.time = new Date();

    console.log(userDetail);

    return res.json("done");
};

// send mail
var sendMail = function(req, res) {
    presentationLib.mail(req.config, req.params, req.body, req.session, function(
        err,
        present
    ) {
        return res.json({ message: "Mail sent successfully" });
    });
};

//unique client
var isUniquePresentation = function(req, res) {
    presentationLib.uniquePresentation(req.config, req.params, function(data) {
        return res.json(data);
    });
};

var getRecentPresentations = function(req, res) {
    //Get recently updated presentation with count
    presentationLib.getRecentPresent(req.config, req.orgid, function(data) {
        return res.json(data);
    });
};

//get list of presentation
var getPresentationList = function(req, res) {
    console.log("req.orgid", req.orgid);
    //Get recently updated presentation with count
    presentationLib.getPresentationList(req.config, req.orgid, function(data) {
        return res.json(data);
    });
};

/*************************************************/

exports.savePresentation = savePresentation;
exports.getPresentations = getPresentations;
exports.getPresentationById = getPresentationById;
exports.getPresentationByClientId = getPresentationByClientId;
exports.toggleActive = toggleActive;
exports.deletePresentation = deletePresentation;
exports.getPresentationCode = getPresentationCode;
exports.copyPresentation = copyPresentation;
exports.getSlides = getSlides;
exports.saveUserDetails = saveUserDetails;
exports.getPresentationUrl = getPresentationUrl;
exports.sendMail = sendMail;
exports.isUniquePresentation = isUniquePresentation;
exports.getRecentPresentations = getRecentPresentations;
exports.getPresentationList = getPresentationList;
exports.getPresentationsUrl = getPresentationsUrl;