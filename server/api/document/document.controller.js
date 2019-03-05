'use strict';

var _ = require('lodash');
var config = require("../../config/config.js");
var mongo = require("mongodb");

var Grid = require('gridfs-stream');
var fs = require("fs");

var path = require('path');

var docmeta = config.getDb().collection('documents');
var im = require("imagemagick");
var mongoose = require("mongoose");

var conn = mongoose.createConnection("mongodb+srv://KoldunMax:qwerty123@cluster0-m1s1a.mongodb.net/presentbuilder-doc", {})

conn.on('open', function (err, res) {
    console.log("connected");
});

var getDestpath = function(src, w) {
    return src + ".tmp" + w;
};

var saveDocument = function(data, src, doc, docmeta, mimetype, extension, cb) {


    if (!doc) {
        doc = data;
        doc.created = new Date();
    }
    doc.updated = new Date();
    doc.mimetype = mimetype;
    doc.extension = extension;

    var stats = fs.statSync(src)


    doc.filesize = stats.size;

    docmeta.save(doc, function(e, savedDoc) {
        var gfs = Grid(conn.db, mongoose.mongo);

        var filenameIn = savedDoc._id.toString();


        gfs.remove({
            filename: filenameIn
        }, function(err) {

            var ws = gfs.createWriteStream({
                filename: filenameIn,
                metadata: {
                    contextid: doc.contextid,
                    contexttype: doc.contexttype,
                    doctype: doc.doctype,
                    size: doc.size,
                    docid: savedDoc._id
                }

            });
            ws.on("close", function(f) {
                savedDoc.documentid = f._id;
                docmeta.save(doc);
                if (cb) {
                    cb();

                }

                //fs.unlink (src); //delete the temp file
            })
            fs.createReadStream(src).pipe(ws);

        });

    });
};

var resizeToIcon = function(data, w, src, mimetype, extension) {

    var dstPath = getDestpath(src, data.size);

    im.resize({
        srcPath: src,
        dstPath: dstPath,
        width: w
    }, function(err, out, stderr) {

        if (!err) {

            docmeta.findOne({
                contextid: data.contextid,
                doctype: data.doctype,
                contexttype: data.contexttype,
                size: data.size
            }, function(err, doc) {

                console.log("resizing to " + dstPath);
                saveDocument(data, dstPath, doc, docmeta, mimetype, extension);

            });
        }



    });
};


var updateProfile = function(config, username) {


    var db = config.collections.profile;

    db.findOne({ socialid: username }, function(err, profile) {


        var hash = new config.ObjectId();
        hash = hash.toString();

        profile.haspic = true;
        profile.pichash = hash;
        profile.updated = new Date();

        db.save(profile);
    });

};


var uploadDoc = function(config, data, src, mimetype, extension, cb) {
    //put the meta data in db ..and then store the actual in grifs
    docmeta.findOne({
        contextid: data.contextid,
        doctype: data.doctype,
        contexttype: data.contexttype,
        size: data.size
    }, function(err, doc) {


        saveDocument(data, src, doc, docmeta, mimetype, extension, function(err, d) {

            if (data.doctype === 'photo' || data.doctype == "profile" ||
                data.doctype === 'profilepic' || data.doctype === 'picture') {

                resizeToIcon({
                        contextid: data.contextid,
                        doctype: data.doctype,
                        contexttype: data.contexttype,
                        size: 'small'
                    },
                    50, src, mimetype, extension);

                resizeToIcon({
                        contextid: data.contextid,
                        doctype: data.doctype,
                        contexttype: data.contexttype,
                        size: 'medium'
                    },
                    100, src, mimetype, extension);


                updateProfile(config, data.contextid);

            }


            if (cb) {
                cb({ status: 'ok' });
            }




        });






    });
};

var index = function(req, res) {


    console.log("**** uploading profile picture *****");

    var data = {};
    data.contextid = req.headers.contextid || req.body.contextid;
    data.doctype = req.headers.doctype || req.body.doctype;
    data.contexttype = req.headers.contexttype || req.body.contexttype;
    data.size = 'normal';



    if (!data.contextid || !data.doctype) {
        res.json({ error: "missing meta data" });
        return;
    }




    var src = req.files.file.path;

    var mimetype = req.files.file.mimetype;
    var extension = req.files.file.extension;

    uploadDoc(req.config, data, src, mimetype, extension, function() {});

    res.json({ status: 'ok' });



};

var queryDocument = function(data, res, cb) {


    var filePath = path.join(__dirname, "defimage.png");


    docmeta.findOne(data, function(err, doc) {
            if (!doc) {
                var img = fs.readFileSync(filePath);
                res.writeHead(200, { 'Content-Type': 'image/png' });
                res.end(img, 'binary');
                return;
            } else {
            res.setHeader("Content-Type", doc.mimetype);

            console.log("opening --docid " + doc.documentid);
            
            var gfs = Grid(conn.db, mongoose.mongo);
            
            var readstream = gfs.createReadStream({
                _id: doc.documentid
            });

            readstream.on('open', function() {
                // This just pipes the read stream to the response object (which goes to the client)
                readstream.pipe(res);
            });

            readstream.on("error", function() {
                var img = fs.readFileSync(filePath);
                res.writeHead(200, { 'Content-Type': 'image/png' });
                res.end(img, 'binary');
            });
        }

    });
};

var getdocument = function(req, res) {


    var contextid = req.params.contextid;
    var doctype = req.params.doctype;
    var contexttype = req.params.contexttype;
    var size = req.params.size;

    var q = { contextid: contextid, contexttype: contexttype, doctype: doctype };
    if (size) {
        q.size = size;
    }

    queryDocument(q, res, function() {});


};

/***********************************************************************************************************/
var getProfilePic = function(req, res) {
    var socialid = req.params.socialid;

    var contextid = socialid;
    var doctype = "profile";
    var contexttype = "user";
    var size = "small";

    var q = { contextid: contextid, contexttype: contexttype, doctype: doctype };


    queryDocument(q, res, function() {});

};

/***********************************************************************************************************/
var getIp = function(req) {

    //console.log (req.connection);

    var ip = req.connection.remoteAddress;
    if (ip.indexOf("127") >= 0) {
        //this means you are behind the proxy

        ip = req.headers["x-forwarded-for"] || req.headers["x-real-ip"];
    }


    return ip;

};
var sendLogo = function(res) {

    var filePath = path.join(__dirname, "app.png");
    var img = fs.readFileSync(filePath);
    res.writeHead(200, { 'Content-Type': 'image/png' });
    res.end(img, 'binary');

};

var getLogo = function(req, res) {
    var emailid = req.params.emailid;

    var emaildb = req.config.collections.emaillogs;

    console.log("*** email being opened -- " + emailid);
    var query = { _id: req.config.ObjectId(emailid) };
    console.log(query);

    emaildb.findOne(query, function(err, email) {

        if (email != null) {

            if (email.isread) {
                return sendLogo(res);
            }

            email.readOn = new Date();
            //more info..like ip browser etc..
            email.readFrom = getIp(req);
            email.isread = true;

            emaildb.save(email, function(e, email) {
                return sendLogo(res);
            });


        } else {
            return sendLogo(res);
        }

    });


};

/***********************************************************************************************************/
var getEmailId = function(req, res) {
    var emailid = req.params.emailid;
    var emaildb = req.config.collections.emaillogs;
    var query = { _id: req.config.ObjectId(emailid) };
    emaildb.findOne(query, function(err, email) {
        if (email) {
            return res.json({ email: email.to });

        }

        return res.json({ email: "invalid email", error: "invalid email" });
    });

};


/***********************************************************************************************************/
var unsubscribeEmail = function(req, res) {
    var emailid = req.params.emailid;

    var emailid = req.params.emailid;
    var emaildb = req.config.collections.emaillogs;
    var query = { _id: req.config.ObjectId(emailid) };

    emaildb.findOne(query, function(err, email) {
        if (email) {

            var removedb = req.config.collections.unsubscribed_emails;
            removedb.save({ email: email.to, created: new Date() });
            //check if alredy un-subcribed.

            return res.json({ status: "ok" });

        } else {
            return res.json({ status: "ok" });
        }


    });


};



/***********************************************************************************************************/
exports.uploadDoc = uploadDoc;
exports.getProfilePic = getProfilePic;
exports.getdocument = getdocument;
exports.getLogo = getLogo;
exports.getEmailId = getEmailId;
exports.unsubscribeEmail = unsubscribeEmail;
exports.index = index;

