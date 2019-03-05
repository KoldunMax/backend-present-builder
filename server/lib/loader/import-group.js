var config = require('../../config/config.js');
var async = require("async");

var getGroupDb = function() {
    return config.collections.groups;
};
var getGroupItemDb = function() {
    return config.collections.groupitems;
};

var groupdb = config.collections.groups;

var groupitemdb = config.collections.groupitems;

var orgdb = config.collections.organization;

var loadGroup = function(grpdb, grpitemdb, group, cb) {

    //assume blank db..
    var codevalue = {};
    codevalue.name = group.name;
    codevalue.lowername = group.name.toLowerCase();
    codevalue.code = group.key.toUpperCase();
    codevalue.active = true;

    grpdb.findOne({code: codevalue.code}, function (e, c){
    
        if (c){
            codevalue._id = c._id;
        }

        grpdb.save(codevalue, function(err, result) {

            async.each(group.codes, function(cs, callback) {

                var code = {};
                code.name = cs.name;
                code.groupid = result._id.toString();
                code.code = cs.code.toUpperCase();
                code.active = true;
                grpitemdb.findOne({groupid : code.groupid, code : code.code}, function (e, r){
                    if (r){
                        code._id = r._id;
                    }
                    grpitemdb.save(code, callback);

                });
                

            }, cb);

        });


    });

  
     
};

var load = function(file) {
    // body...
    
    var fs = require('fs');
    var groupval = JSON.parse(fs.readFileSync(file, 'utf8'));

    var grpdb = getGroupDb();
    var grpitemdb = getGroupItemDb();

    async.each(groupval, function(group, cb) {
            console.log ("importing ..." + group.name);
        loadGroup(grpdb, grpitemdb, group, cb);
    }, function() {
        console.log ("process finished");
    });
};






exports.load = load;


//load("../../data/group.json");
