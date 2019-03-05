var request = require("request");
var async = require("async");



// Save/Update organization
var saveOrgData = function(config, org, cb) {

    if (org.name && (org.name === null || org.name.trim().length === 0)) {
        return cb({ status: "fail", message: "Invalid organization name.", error: "Invalid organization name." });
    }

    if (org._id) {
        org._id = config.ObjectID(org._id);
    }


    org.active = org.active ? org.active : false;

    org.isdelete = org.isdelete ? org.isdelete : false;

    var identifier = org.name.toLowerCase();

    config.collections.organization.find({ "identifier": identifier }, function(er, res) {

        if (res && res.length == 1 && org._id.toString() != res[0]._id.toString()) {
            return cb({ status: "fail", message: "Organization name is already taken." });
        } else {
            org.updated = new Date();
            config.collections.organization.save(org, function(e, r) {
                return cb(r);
            });
        }
    });
};

var getOrgList = function(config, cb) {
    config.collections.organization.find({ "isdelete": false }).sort({ "updated": -1 }, function(e, r) {

        if(r.length > 0){
            async.eachSeries(r,function(data, callback){
                var id = data._id.toString();
                config.collections.users.count({ "orgid" : id, "deleted": false },function(e, cnt) {
                    data.user_count = cnt;
                    return callback();
                });

            },function(){
                return cb(r);    
            });

        } else {

            return cb(r);

        }     
        
    });
};
/*************public function************/
exports.saveOrgData = saveOrgData;
exports.getOrgList = getOrgList;