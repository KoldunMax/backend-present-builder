
var Grid = require('gridfs-stream');
var mongo = require("mongodb");
var mongoose = require("mongoose");

var deleteFromGrid = function (config, id){

	var conn = mongoose.createConnection("mongodb+srv://KoldunMax:qwerty123@cluster0-m1s1a.mongodb.net/presentbuilder-doc", {})

	conn.on('open', function (err, res) {
		if (err) {
			return;
		}

		var gfs = Grid(conn.db, mongoose.mongo);

		gfs.remove({
			_id: config.ObjectId(id)
		});
	});
};

var deleteDoc = function (config, docid, cb){

	if (!docid){
		return cb && cb();
	}
	var docmeta = config.getDocDB().collection('documents');
	docmeta.remove ({documentid : docid}, function (e, d){
		deleteFromGrid (config, docid);
	});


	return cb  && cb ();
};


var getDocumentByContextId = function(config, data, writable, cb) {

    var contextid = data.contextid;
    var doctype = data.doctype;
     
	var docmeta = config.getDocDB().collection('documents');

    docmeta.findOne({ contextid: contextid, doctype: doctype }, function(err, doc) {

        if (!doc) {
            cb ({error : 'no image found'});
            return;
        } else {
            //res.setHeader("Content-Type", doc.mimetype);


		var conn = mongoose.createConnection("mongodb+srv://KoldunMax:qwerty123@cluster0-m1s1a.mongodb.net/presentbuilder-doc", {})



		conn.on('open', function (err, res) {
			var gfs = Grid(conn.db, mongoose.mongo);

            var readstream = gfs.createReadStream({
                _id: doc.documentid
            });

			readstream.on ("end", function (){
				cb (null, doc);
			});
			
			readstream.pipe(writable);
		});



           
        }

    });

};


exports.deleteDoc = deleteDoc;
exports.getDocumentByContextId = getDocumentByContextId;