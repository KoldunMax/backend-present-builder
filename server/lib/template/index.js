

var request = require("request");

var saveTemp = function(config, reqbody, reqorgid, id, cb){
    var template = {};

     if (typeof id !== 'undefined') {
        template._id = config.ObjectID(id);
        template.createdon = new Date();
        template.updatedon = new Date();
    } else {
        template.createdon = new Date();
        template.updatedon = new Date();
    }


    template.name = reqbody.name.toLowerCase();
    template.description = reqbody.description;
    template.createdby = reqbody.createdby;
    template.updatedby = reqbody.updatedby;
    template.orgid = reqorgid;
    config.collections.templates.save(template, function(err, temp) {

        return cb(temp);

    });
};

var getTemp = function(config,reqorgid,cb){

    config.collections.templates.find({"orgid" : reqorgid}, function(err, response) {
   
        return cb(response);
    });
};

var getTempById = function(config,reqorgid,id,cb){

      config.collections.templates.findOne({ "_id": config.ObjectID(id) ,"orgid" : reqorgid}, function(err, template) {

        return cb(template);

    });
};


var deleteTemp = function(config,tempid,cb){
    
   config.collections.templates.remove({ "_id": config.ObjectID(tempid) }, function(err, eres) {
        return cb({'status' : 'success', 'message': 'Deleted template successfully'});
    });
};

exports.deleteTemp = deleteTemp;
exports.getTemp = getTemp;
exports.getTempById = getTempById;
exports.saveTemp = saveTemp;
