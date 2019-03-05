var docLib = require("../document/index.js");

var deleteDocs = function(config, orgid, content, cb) {

    //delete all docs on this content
    //

    docLib.deleteDoc(config, content.contentaudio);
    docLib.deleteDoc(config, content.contentvideo);
    docLib.deleteDoc(config, content.contentimage);


    return cb && cb();
};


var deleteContent = function(config, orgid, contentId, reqsesion, cb) {

    var db = config.collections.slidecontent;

    var q = {
        "_id": config.ObjectId(contentId),
        "orgid": orgid
    };

    db.findOne(q, function(e, content) {

        db.remove(q, function(e, r) {
            deleteDocs(config, orgid, content);
        });
        deleteContentActvity(config, orgid, content, reqsesion);
        return cb && cb();
    })
};

var deleteContentActvity = function(config, orgid, content, reqsession) {

    var deleteContentActivity = {};
    deleteContentActivity.objecttype = "slide content";
    deleteContentActivity.type = "deleted";
    //deleteContentActivity.activity_name = menu.name;
    deleteContentActivity.activity_date = new Date();
    deleteContentActivity.activity_by = reqsession.user.username;
    deleteContentActivity.user_id = reqsession.user.userid;
    config.collections.recentactivity.save(deleteContentActivity, function(err, response) {

    });


}


exports.deleteContent = deleteContent;