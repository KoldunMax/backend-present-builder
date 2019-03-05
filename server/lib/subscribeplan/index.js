var request = require("request");

// save plan
var subscribePlan = function(req, cb) {


    var id = req.body._id;

    var subscribeplan = {};
    if (typeof id !== 'undefined') {
        subscribeplan._id = req.config.ObjectID(id);
        subscribeplan.updatedon = req.body.createdon;
    } else {
        subscribeplan.createdon = new Date();
        subscribeplan.updatedon = new Date();
    }
    if(req.body.plan){
    subscribeplan.planid = req.body.plan._id;
    }else{
        subscribeplan.planid = req.body.planid;
    }
    subscribeplan.orgid = req.orgid || req.body.orgid;
    subscribeplan.userid = req.body.userid;
    subscribeplan = req.body;
    //If user has anothe plan subscribed unsubscribe that
    deactivateOtheplan(req.config.collections.subscribeplans, subscribeplan.orgid, function () {
       
        /* body... */
        req.config.collections.subscribeplans.save(subscribeplan, function(err, response) {
            console.log("tets",response);
           if(response.plan){
            req.config.collections.plans.findOne({ _id: req.config.ObjectID(response.plan._id)}, function(err,plan) {
               
               updatePlan(req.config,plan);
               return cb(response);
            });        
           }else{
                req.config.collections.plans.findOne({ _id: req.config.ObjectID(response.planid)}, function(err,plan) {
               
               updatePlan(req.config,plan);
               return cb(response);
            });

           }
        });

    });
};


var deactivateOtheplan = function (db, orgid, cb) {

   db.update({ "orgid": orgid },{ $set: { "isactive" : false } }, { "multi" : true }, function(err, response) {

        console.log("Response :: ", err, response);

        return cb();

    });
};


var updatePlan = function (config, p){

    var db = config.collections.plans;
    p.updatedon = new Date();
    p.issubscribe = true;
    db.save(p,function (error,response){
       
    });
};


// delete plan
var deleteeSubscribePlan = function(req, cb) {
    var id = req.params.id;
    req.config.collections.subscribeplans.remove({ "_id": req.config.ObjectID(id) }, function(err, eres) {
        return cb({ 'status': 'success', 'message': 'Deleted plan successfully' });
    });
};


// get list of plans based on orgid
var getMyPlan = function(req, cb) {
    

    req.config.collections.subscribeplans.find({"orgid":req.orgid, isactive : true},function(err, response) {
        return cb(response);
    });

};


// get one record based on id
var geteSubscribePlanById = function(req, cb) {
    var id = req.params.id;
    req.config.collections.subscribeplans.findOne({ "_id": config.ObjectID(id) }, function(err, plan) {
        return cb(plan);
    });
};

var getSubscribePlans = function(req,cb){

    req.config.collections.subscribeplans.find( {$and: [ {"orgid" : req.params.id}, {"isactive" : true } ]}, function(err, subscribeplan) {

        console.log("subscribeplan",subscribeplan);
        return cb(subscribeplan);
    });

};


var getCurrentSubscribePlan = function(req,cb){

    req.config.collections.subscribeplans.findOne( {$and: [ {"orgid" : req.params.id}, {"isactive" : true } ]}, function(err, subscribeplan) {
        return cb(subscribeplan);
    });

};

var getPlanHistory = function (req,cb){

     req.config.collections.subscribeplans.find( {$and: [ {"orgid" : req.params.id}, {"isactive" : false } ]}).sort({"substartdate":-1}, function(err, Planhistory) {
         console.log("planhistory::",Planhistory);
        return cb(Planhistory);
    });

};


exports.subscribePlan = subscribePlan;
exports.deleteeSubscribePlan = deleteeSubscribePlan;
exports.getMyPlan = getMyPlan;
exports.geteSubscribePlanById = geteSubscribePlanById;
exports.getSubscribePlans = getSubscribePlans;
exports.getCurrentSubscribePlan = getCurrentSubscribePlan;
exports.getPlanHistory = getPlanHistory;