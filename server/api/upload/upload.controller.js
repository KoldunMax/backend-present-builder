'use strict';

var _ = require('lodash');
var config = require("../../config/config.js");
//var core = require ("../../config/core.js");
var Grid = require('gridfs-stream');
var mongo = require("mongodb");
var fs = require("fs");
var path = require('path');
var ObjectID = require('mongodb').ObjectID;
var docmeta = config.getDocDB().collection('documents');
var im = require("imagemagick");
var mongoose = require("mongoose");

var conn = mongoose.createConnection("mongodb+srv://KoldunMax:qwerty123@cluster0-m1s1a.mongodb.net/presentbuilder-doc", {})

conn.on('open', function (err, res) {
    console.log("connected");
});

// Uploads document based on organizationid and userid
var index = function(req, res) {

    console.log(" --  in upload");
   
    var data = {};
    data.contextid = req.headers.contextid || req.body.contextid;
    data.doctype = req.headers.doctype || req.body.doctype;
    data.contexttype = req.headers.contexttype || req.body.contexttype;
    data.uploadedby = req.headers.uploadedby || req.session.user.userid;
    if (req.headers.uid) {
        data.uid = req.headers.uid;
    } else {
        data.uid = req.headers.contextid;
    }
    data.documenttype = req.headers.documenttype;

    if (!data.contextid || !data.doctype) {
        return res.json({
            error: "missing meta data"
        });
    }
    
    if (!req.files && req.file) {
        req.files = {
            file: req.file
        };
    }

   
    var src = req.files.file.path;

    //put the meta data in db ..and then store the actual in grifs


    if (req.headers.documentid) {

        console.log("--- Updating document -----");
        docmeta.findOne({
            "_id": new ObjectID(req.headers.documentid)

        }, function(err, doc) {
            console.log("--- Updating  document -----");
            saveDocument(data, src, doc, docmeta, req, res);
        });
    } else {
        console.log("--- Uploading document -----");
        saveDocument(data, src, "", docmeta, req, res);
        // docmeta.findOne({
        //     contextid: data.contextid,
        //     doctype: data.doctype
        // }, function(err, doc) {
        //     saveDocument(data, src, "", docmeta, req, res);
        // });
    }


};


// Get destination path
var getDestpath = function(src, w) {
    return src + ".tmp" + w;
};

// Resize icon
var resizeToIcon = function(data, w, src, req) {
    data.doctype = data.doctype + w;
    var dstPath = getDestpath(src, w);
    im.resize({
        srcPath: src,
        dstPath: dstPath,
        width: w
    }, function(err, out, stderr) {
        if (!err) {
            docmeta.findOne({
                contextid: data.contextid,
                doctype: data.doctype
            }, function(err, doc) {
                saveDocument(data, dstPath, doc, docmeta, req);
            });
        }
    });
};

// Save uploaded document
var saveDocument = function(data, src, doc, docmeta, req, res) {

    if (!doc) {
        doc = data;
        doc.created = new Date();
    }
    doc.updated = new Date();
    doc.mimetype = req.files.file.mimetype;
    doc.extension = req.files.file.extension;
    doc.size = req.files.file.size;
    doc.height = req.files.file.height;
    doc.width = req.files.file.width;
    doc.name = req.files.file.originalname || req.files.file.name;
    doc.documenttype = req.body.documenttype;
    doc.uploadedby = data.uploadedby || req.session.user.userid;
    doc.uid = data.uid;
    doc.documenttype = data.documenttype;
    
    docmeta.save(doc, function(e, savedDoc) {
        console.log('upload save')

        var gfs = Grid(conn.db, mongoose.mongo);
        var filenameIn = savedDoc._id.toString() + "_" + doc.contextid + "_" + doc.doctype;
        gfs.remove({
            filename: filenameIn
        }, function(err) {
            var ws = gfs.createWriteStream({
                filename: filenameIn,
                metadata: {
                    contextid: doc.contextid,
                    contexttype: doc.contexttype,
                    doctype: doc.doctype,
                    docid: savedDoc._id,
                    uploadedby: doc.uploadedby
                }
            });
            ws.on("close", function(f) {
                savedDoc.documentid = f._id;
                docmeta.save(doc);
                if (res) {
                    return res.send(doc);
                }
            });
            fs.createReadStream(src).pipe(ws);
            //fs.writeFileSync("./temp/sample.pdf", req.files.file.data);
        });

    });
};



var updateDoctypeDocuments = function(req, res) {

    docmeta.update({
        "_id": new ObjectId(req.body.docid)
    }, {
        $set: { documenttype: req.body.documenttype }
    }, function(err, response) {
        res.json({});
    });
};

var updateDocHeight = function(req, res) {

    docmeta.update({
        "_id": new ObjectID(req.body.docid)
    }, {
        $set: { height: req.body.height, width:req.body.width}
    }, function(err, response) {
        res.json({});
    });
};

var getDocumentByDoctype = function(req, res) {

    var contextid = req.params.contextid;
    var doctype = req.params.doctype;
    var db = req.clientdb;
    var uid = req.params.uid;

    docmeta.findOne({ contextid: contextid, doctype: doctype, documentid: { $exists: true } }, function(err, doc) {

        if (!doc) {
            var filePath = path.join(__dirname, "defimage.png");

            var img = fs.readFileSync(filePath);
            res.writeHead(200, { 'Content-Type': 'image/png' });
            res.end(img, 'binary');
            return;
        } else {
            res.setHeader("Content-Type", doc.mimetype);
            console.log('upload doctype')

            var gfs = Grid(conn.db, mongoose.mongo);
            var readstream = gfs.createReadStream({
                _id: doc.documentid
            }).pipe(res);
        }

    });

};

var getDocumentById = function(req, res) {

    var docid = req.config.ObjectId(req.params.docid);
    var db = req.clientdb;

    docmeta.findOne({ _id: docid }, function(err, doc) {

        if (!doc) {
            var filePath = path.join(__dirname, "defimage.png");
            var img = fs.readFileSync(filePath);
            res.writeHead(200, { 'Content-Type': 'image/png' });
            res.end(img, 'binary');
            return;
        } else {
            res.setHeader("Content-Type", doc.mimetype);
            console.log('upload byid')
            var gfs = Grid(conn.db, mongoose.mongo);
            var readstream = gfs.createReadStream({
                _id: doc.documentid
            }).pipe(res);
        }

    });

};

var getDocument = function(req, res) {

    var contextid = req.params.contextid;
    var doctype = req.params.doctype;
    var docid = req.params.docid;
    var uid = req.params.uid;

    var json = {
        contextid: contextid,
        doctype: doctype
    }
    if (docid && docid != 0) {
        json._id = new ObjectId(docid);
    }

    docmeta.find(json, function(err, docs) {
        var doc = null;


        if (docs.length > 0) {
            doc = docs[0];
        }

        if (!doc || doc == null) {
            var filePath = path.join(__dirname, "defimage.png");
            var img = fs.readFileSync(filePath);
            res.writeHead(200, {
                'Content-Type': 'image/png'
            });
            res.end(img, 'binary');
            return;
        } else {
            res.setHeader("Content-Type", doc.mimetype);
            console.log('upload just doc')
            var gfs = Grid(conn.db, mongoose.mongo);
            var readstream = gfs.createReadStream({
                _id: doc.documentid
            });
            return readstream.pipe(res);
            /*
            //console.log(readstream);
            readstream.on('error', function(err) {
                console.log('An error occurred while reading!', err);
            });
            var filedata = [];
            readstream.on('data', function(data) {
                filedata.push(data);
            });
            readstream.on('end', function() {
                var buffer = Buffer.concat(filedata);
                res.end(buffer, "binary");
            });
        */
        }

    });

};

var getAllDocuments = function(req, res) {


    docmeta.find({
        contextid: req.params.contextid
    }, function(err, response) {

        if (err || !response) {
            return res.json([]);
        } else {
            return res.json(response);
        }

    });
};

var deleteDocument = function(req, res) {

    docmeta.remove({ "documentid": new ObjectId(req.params.docid) }, function(err, eres) {

        return res.json({});

    });
};

var finalizeUpload = function(tempdocId, req, res) {

    temp_docs.findOne({ _id: req.config.ObjectId(tempdocId) }, function(err, doc) {
        var tempDir = hcconfig.tempDir;
        var src = tempDir + "/" + tempdocId;
        console.log('upload finalizeUpload')
        docmeta.save(doc, function(e, savedDoc) {
            var gfs = Grid(conn.db, mongoose.mongo);
            var filenameIn = savedDoc._id.toString() + "_" + doc.contextid + "_" + doc.doctype;
            gfs.remove({
                filename: filenameIn
            }, function(err) {

                var ws = gfs.createWriteStream({
                    filename: filenameIn,
                    metadata: {
                        contextid: doc.contextid,
                        contexttype: doc.contexttype,
                        doctype: doc.doctype,
                        docid: savedDoc._id
                    }

                });
                ws.on("close", function(f) {
                    savedDoc.documentid = f._id;
                    docmeta.save(doc);
                    if (res) {

                        return res.send(doc);

                    }

                    //delete the temp file herer .. 
                    fs.unlinkSync(src);
                });

                //ws.write(req.files.file.data);
                //ws.end();
                fs.createReadStream(src).pipe(ws);
                //fs.writeFileSync("./temp/sample.pdf", req.files.file.data);

            });

        });


    });
};

var chunkUpload = function(req, res) {

    //now its time to save the file in temp dir..
    var tempDir = hcconfig.tempDir;
    if (!fs.existsSync(tempDir)) {
        return res.json({ "error": "no temp directory configured on server : " + tempDir });
    }

    var data = {};
    //all constant information
    data.contextid = req.headers.contextid;
    data.doctype = req.headers.doctype;
    data.contexttype = req.headers.contexttype;
    data.size = req.headers.size;
    data.mimetype = req.headers.mimetype;
    data.name = req.headers.filename;
    data.extension = req.headers.extension;

    //all changing information
    data.documentid = req.body.documentid;
    data.isLast = req.body.isLast;
    data.chunks = req.body.chunks; //base64 chunks

    if (!data.contextid || !data.contexttype) {
        return res.json({ "error": "contextid and contextype is required" });
    }

    if (!data.documentid && data.chunks) {
        return res.json({ "error": "document id is required before uploading chunks" });
    }


    if (!data.documentid) {
        temp_docs.save(data, function(err, doc) {
            return res.json({ "documentid": doc._id.toString() });
        });
        return;
    }

    var file = tempDir + "/" + data.documentid;
    var buffer = new Buffer(data.chunks, "base64");
    //console.log("found chunk of len : " + buffer.length + " == " + data.size);

    var fd = fs.openSync(file, "a");
    fs.writeSync(fd, buffer, 0, buffer.length);
    fs.closeSync(fd);

    if (!data.isLast) {
        return res.json({ status: "ok", n: n });
    }

    finalizeUpload(data.documentid, req, res);
};

var getMyContent = function(req, res) {

    var q = {
        contextid: req.session.user.orgid.toString(),
        uploadedby: req.session.user.userid.toString()
    };

    //TODO : Fetch all type of video
    if (req.query && req.query.type == 'video') {
        q.mimetype = "video/mp4";
    }

    docmeta.find(q, function(err, response) {
        if (err || !response) {
            return res.json([]);
        } else {
            return res.json(response);
        }
    });
};

var deleteMyContent = function(req, res) {
    docmeta.remove({ "_id": req.config.ObjectId(req.params.id) }, function(err, response) {
        if (err || !response) {
            return res.json([]);
        } else {
            return res.json(response);
        }

    });
};

var getMyOrganizationDocuments = function(req, res) {

    docmeta.find({
        contextid: req.session.user.orgid
    }, function(err, response) {
        if (err || !response) {
            return res.json([]);
        } else {
            return res.json(response);
        }
    });
};

var getDocumentsByType = function(req, res) {
    if (!req.session || !req.session.user) {
        return res.json([]);
    }
    var type = req.params.type;
    var q = { uid: req.session.user.orgid.toString(), contexttype: type };
    if (type !== 'sharedcontent') {
        q.uploadedby = req.session.user.userid.toString();
    }

    docmeta.find(q, function(err, response) {
        if (err || !response) {
            return res.json([]);
        } else {
            return res.json(response);
        }
    });
};

var deleteDocByType = function(req, res) {

    docmeta.remove({ "contextid": req.body.id, "doctype": req.body.doctype }, function(err, response) {
        if (err || !response) {
            return res.json([]);
        } else {
            return res.json(response);
        }

    });
};





/******************** getDocPreview  */
var getDocPreview = function(req, res) {


    var mimetype = req.params.mimetype;
    var docId = req.params.docid;
    var fname = "file.jpg";
   
    if (mimetype.indexOf("pdf") >= 0) {
        fname = "pdf.png";
    } else if (mimetype.indexOf("word") >= 0) {
        fname = "word.png";
    } else if(mimetype.indexOf("mp4") >= 0){
       
        fname = "video.png"
    }
    //similarly use other type of files. extensions and mimetypes


    var filePath = path.join(__dirname, fname);

    var img = fs.readFileSync(filePath);
    res.writeHead(200, { 'Content-Type': 'image/jpg' });
    res.end(img, 'binary');

};

var updateDocumentDetails = function(req, res) {

    var id = req.body._id;
    docmeta.findOne({ "_id": req.config.ObjectId(id) }, function(err, doc) {

        doc.title = req.body.title;
        doc.caption = req.body.caption;
        doc.alttext = req.body.alttext;
        doc.description = req.body.description;
        docmeta.save(doc, function(e, savedDoc) {
            if (e) {
                return res.json(e);
            } else {
                return res.json(savedDoc);
            }

        });
    });

};

// All public functions
exports.chunkUpload = chunkUpload;
exports.deleteDocument = deleteDocument;
exports.getAllDocuments = getAllDocuments;
exports.getDocumentByDoctype = getDocumentByDoctype;
exports.getDocument = getDocument;
exports.updateDoctypeDocuments = updateDoctypeDocuments;
exports.index = index;
exports.getMyContent = getMyContent;
exports.deleteMyContent = deleteMyContent;
exports.getMyOrganizationDocuments = getMyOrganizationDocuments;
exports.getDocumentsByType = getDocumentsByType;
exports.getDocumentById = getDocumentById;
exports.deleteDocByType = deleteDocByType;
exports.getDocPreview = getDocPreview;
exports.updateDocumentDetails = updateDocumentDetails;
exports.updateDocHeight = updateDocHeight;