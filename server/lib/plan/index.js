var request = require("request");

// save plan
var savePlan = function(req, cb) {

    var id = req.body._id;

    var plan = {};

    if (typeof id !== 'undefined') {
        plan._id = req.config.ObjectID(id);
        plan.updatedon = req.body.createdon;
    } else {
        plan.createdon = new Date();
        plan.updatedon = new Date();
    }
    plan.name = req.body.name;
    plan.description = req.body.description;
    plan.startdate = req.body.startdate;
    plan.expirydate = req.body.expirydate;
    plan.presentation_count = req.body.presentation_count;
    plan.slide_per_presentation = req.body.slide_per_presentation;
    plan.price = req.body.price;
    plan.issubscribe = (req.body.issubscribe) ? req.body.issubscribe : false;
    plan.isactive = (req.body.isactive) ? req.body.isactive : false;
    req.config.collections.plans.save(plan, function(err, response) {

        return cb(response);

    });
};

// delete plan
var deletePlan = function(req, cb) {
    var id = req.params.id;
    req.config.collections.plans.remove({ "_id": req.config.ObjectID(id) }, function(err, eres) {
        return cb({ 'status': 'success', 'message': 'Deleted plan successfully' });
    });
};


// get list of plans based on orgid
var getPlans = function(req, cb) {
    var q = {};

    //TODO : Show all plans to admin only
    // if (req.session.user.role == 'admin') {
    //     q = { "isactive": true };
    // }
    req.config.collections.plans.find(q).sort({ updatedon: -1 }, function(err, response) {
        return cb(response);
    });
};


// get one record based on id
var getPlanById = function(req, cb) {
    var id = req.params.id;
    req.config.collections.plans.findOne({ "_id": req.config.ObjectID(id) }, function(err, plan) {
        return cb(plan);
    });
};

var toggleActive = function(req, cb) {

    req.config.collections.plans.findOne({ "_id": req.config.ObjectId(req.body.id) }, function(err, plan) {
        plan.isactive = req.body.status;
        plan.updated = new Date();

        req.config.collections.plans.save(plan, function(err, r) {

            return cb(r);
        });

    });

};


var getActivePlans = function(req, cb) {
   
    req.config.collections.plans.find({"isactive" : true}, function(err, response) {
        return cb(response);
    });
};



exports.savePlan = savePlan;
exports.deletePlan = deletePlan;
exports.getPlans = getPlans;
exports.getPlanById = getPlanById;
exports.toggleActive = toggleActive;
exports.getActivePlans = getActivePlans;