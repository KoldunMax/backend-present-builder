'use strict';
// var phantom = require('phantom');
var pdf = require("html-pdf");
var requestify = require('requestify');
var async = require('async');
var merge = require('easy-pdf-merge');
var fs = require('fs');
var Grid = require('gridfs-stream');
var mongo = require("mongodb");
var mongoose = require("mongoose");



var saveDocument = function(data, src, doc, docmeta, req, res) {

    var conn = mongoose.createConnection("mongodb+srv://KoldunMax:qwerty123@cluster0-m1s1a.mongodb.net/presentbuilder-doc", {})


    conn.on('open', function (err, res) {
        console.log("connected");
    });

    if (!doc) {
        doc = data;
        doc.created = new Date();
    }
    doc.updated = new Date();
    doc.mimetype = 'application/pdf';
    doc.extension = 'pdf';

    docmeta.save(doc, function(e, savedDoc) {

        var gfst = Grid(conn.db, mongoose.mongo);
        var filenameIn = doc.contextid + "_" + doc.doctype;


        gfst.remove({
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
                    res.send({
                        status: 'ok',
                        documentid : f._id
                    });
                }
            })
            fs.createReadStream(src).pipe(ws);

        });

    });
};


var uploadPDF = function(filepath, id, req, res) {

    var docmeta = req.config.collections.documents;

    var data = {};
    data.contextid = id;
    data.doctype = 'pdf';
    data.contexttype = 'slidepdf';

    //put the meta data in db ..and then store the actual in grifs
    docmeta.findOne({ contextid: data.contextid, doctype: data.doctype }, function(err, doc) {
        saveDocument(data, filepath, doc, docmeta, req, res);

    });


};


var generatePDF = function(req, res) {

    var presentation_id = req.params.id;
    // // TO:DO-- get all slides url from presentation.


    var slides = [{
        'url': 'http://ducks2016.platform.sportsdigita.com/great-clips?viewerEmail=dchristensen%40anaheimducks.com#/',
        'id': '12'
    }, {
        'url': 'http://ducks2016.platform.sportsdigita.com/great-clips?viewerEmail=dchristensen%40anaheimducks.com#/who-we-are/anaheim-ducks2',
        'id': '123'
    }, {
        'url': 'http://ducks2016.platform.sportsdigita.com/great-clips?viewerEmail=dchristensen%40anaheimducks.com#/who-we-are/honda-center2',
        'id': '1234'
    }];

    var pdfList = [];

    async.eachSeries(slides, function(slide, callback) {

        requestify.get(slide.url).then(function(response) {
            // Get the raw HTML response body
            var html = response.body;

            var config = {
                format: "A4",
                orientation: "portrait"
            };

            // Create the pdf
            pdf.create(html, config).toFile('./pdf/' + slide.id + '.pdf', function(er, re) {
                if (er) {
                    console.log(er);
                }
                pdfList.push('./pdf/' + slide.id + '.pdf')

                return callback();

            });
        });


    }, function(err, resp) {

        var id = new req.config.ObjectId().toString();
        var filepath = './pdf/' + id + ".pdf";

        // Merge all the pdf's
        merge(pdfList, filepath, function(error) {

            if (error) {
                console.log(err);
                return res.json({});
            } else {
            	// Upload the merged pdf

                
                //uploadPDF(filepath, id, req, res);
                return res.json({});
            }


        });

    });
};



exports.generatePDF = generatePDF;
