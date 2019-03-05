'use strict';

var _ = require('lodash');

var generatePassword = require('password-generator');
var coreUtil = require("../../lib/util/coreutil.js");
var emailApi = require("../../lib/email/welcomeemail.js");
var async = require('async');


/**
 * [updateUser - update user details]
 */
var updateUser = function(config, model, cb) {

    if (!model.username) {
        return cb({ status: "fail", message: "missing username" });
    }
    if (!model.firstname) {
        return cb({ status: "fail", message: "missing firstname" });
    }
    if (!model.lastname) {
        return cb({ status: "fail", message: "missing lastname" });
    }

    var db = config.collections.users;

    db.findOne({ _id: config.ObjectID(model._id) }, function(err, user) {

        if (err || !user) {
            return cb(err);
        }

        user.firstname = model.firstname;
        user.lastname = model.lastname;
        user.title = model.title;
        user.name = model.name;
        user.email = model.email;
        user.updated = new Date();
        user.username = model.username;
        user.role = model.role;
        user.jobtitle = model.jobtitle;
        user.joindate = model.joindate;

        db.save(user, function(e, u) {
            return cb(u);
        });

    });
};

var saveOrganization = function(config, model, cb) {

    //check organization if already present with same name
    var identifier = model.companyname.toLowerCase();

    config.collections.organization.find({ "identifier": identifier }, function(er, res) {

        if (res && res.length == 0) {

            config.collections.organization.save({
                name: model.companyname,
                identifier: model.companyname.toLowerCase(),
                firstname: model.firstname,
                lastname: model.lastname,
                email: model.email,
                phone: model.phone,
                isdelete: false,
                active: false,
                updated: new Date()
            }, function(e, org) {
                cb(org);
            });

        } else {

            return cb({ status: "fail", message: "Organization name is already taken." });

        }

    });
};


var assignDefaultPlan = function(config, planid, orgid, userid) {

    var d = {
        "createdon": new Date(),
        "updatedon": new Date(),
        "planid": planid,
        "orgid": orgid,
        "isactive": true
    };

    config.collections.subscribeplans.save(d, function(err, response) {
        console.log("default plan subscribed");
    });
};


var getRole = function(config, org, cb) {

    config.collections.groups.findOne({ "code": "ROLE" }, function(er, group) {

        if (group && group._id) {

            var q = { groupid: group._id.toString(), code: "ADMIN" };

            config.collections.groupitems.findOne(q, function(e, groupCode) {

                if (!e || groupCode) {
                    return cb(groupCode);
                } else {
                    return cb({ status: "fail", message: "Something went wrong. Please contact admin." });
                }

            });

        } else {
            return cb({ status: "fail", message: "Something went wrong. Please contact admin." });
        }
    });
};

/**
 * Create new user
 */
var createUser = function(req, model, cb) {

    var config = req.config;

    //user detail validation
    if (!model.username) {
        return cb({ status: "fail", message: "missing username" });
    }
    if (!model.firstname) {
        return cb({ status: "fail", message: "missing firstname" });
    }
    if (!model.lastname) {
        return cb({ status: "fail", message: "missing lastname" });
    }

    model.username = model.username.toLowerCase();

    var pattern = "^[a-z0-9_-]{3,15}$";
    var r = new RegExp(pattern);

    if (!r.test(model.username)) {
        return cb({ status: "fail", message: "username should only contain letters, numbers, underscore and dashes" });
    }

    //ensure unique username.
    var db = config.collections.users;

    db.findOne({ username: model.username.toLowerCase() }, function(e, u) {

        if (u) {
            return cb({ status: "fail", message: "username is already taken." });
        }

        //validate the email...
        coreUtil.isValidEmail(model.email, function(valid) {

            if (!valid) {
                return cb({ status: "fail", message: "invalid email" });
            }

            var pass = model.username.toLowerCase() === 'admin' ? model.password : genPass();

            var user = {};
            user.username = model.username.toLowerCase();
            user.password = coreUtil.hash(pass);
            user.firstname = model.firstname;
            user.lastname = model.lastname;
            user.title = model.title;
            user.name = model.name;
            user.email = model.email;
            user.updated = new Date();
            user.created = user.updated;
            user.createdby = model.updatedby;
            user.deleted = false;
            user.active = true;
            user.jobtitle = model.jobtitle;
            user.joindate = model.joindate;

            if (model.companyname) {

                saveOrganization(config, model, function(org) {

                    if (org.status == "fail") {
                        return cb(org);
                    }

                    getRole(config, org, function(role) {

                        if (role.status == "fail") {
                            return cb(role);
                        }
                        user.role = role;
                        user.orgid = org._id.toString();
                        db.save(user, function(e, u) {
                            user.password = pass;
                            emailApi.send(user, function() {});
                            //get default plan id
                            //assignDefaultPlan(config, "58a83e20f9a4be2d0f6a7af4",org._id,user._id);
                            return cb({ id: u._id });
                        });
                    });

                });

            } else {

                user.orgid = req.session.user.orgid.toString();
                user.role = model.role;

                db.save(user, function(e, u) {
                    user.password = pass;
                    emailApi.send(user, function() {});
                    return cb({ id: u._id });
                });
            }

        });

    });
};




/**
 * [saveUser - this function crate /update user dwtails]
 * @return {object}  - object with user details
 */
var saveUser = function(req, res) {

    var id = req.body._id;

    if (id) {
        return updateUser(req.config, req.body, function(r) {
            delete r['password']; //delete password befor send response
            return res.json(r);
        });
    } else {
        return createUser(req, req.body, function(r) {
            return res.json(r);
        });
    }
};


var saveCustomer = function(req, res) {
    var db = req.config.collections.usercustomer;
    var customer = req.body;

    db.save(customer, function(err, response) {

        return res.json(response);

    });

}


var getCustomerByUser = function(req, res) {

    var usercustomer_db = req.config.collections.usercustomer;
    var client_db = req.config.collections.clients;
    var config = require('../../config/config.js');
    var db = config.getDb();
    usercustomer_db.find({ "userid": req.params.userid, "orgid": req.orgid }, function(err, clients) {

        //  return res.json(client);
        async.eachSeries(clients, function(resp, callback) {

            client_db.findOne({ "_id": db.ObjectId(resp.clientid) }, function(err, client) {

                if (client) {

                    resp.client_name = client.name;

                }

                return callback();
            });

        }, function() {

            return res.json(clients);

        });


    });

}


/**
 * [genPass - generates password]
 * @return {string} - password string
 */
var genPass = function() {
    var pass = generatePassword(8, false);
    return pass;
};

/**
 * [getUsers - get list of all users]
 * @return {arrary} - array of users with details
 */
var getUsers = function(req, res) {

    var user_db = req.config.collections.users;

    var fields = { username: 1, email: 1, firstname: 1, lastname: 1, active: 1, title: 1, name: 1, role: 1, jobtitle: 1, joindate: 1, };
    if (req.orgid) {
        user_db.find({ deleted: false, orgid: req.orgid }, fields).sort({ updated: -1 }, function(err, users) {

            res.json(users);

        });
    } else {
        user_db.find({ deleted: false }, fields, function(err, users) {

            res.json(users);

        });
    }
};


/**
 * [getUserDetails - Get users details by userid]
 * @return {object} - Object with user details
 */
var getUserDetails = function(req, res) {

    var user_db = req.config.collections.users;
    user_db.findOne({ _id: req.config.ObjectID(req.params.userid), orgid: req.orgid }, function(err, user) {
        res.json(user);
    });
};


var getUserDetailsByUsername = function(req, res) {

    req.config.collections.users.findOne({ username: req.params.username }, function(err, user) {
        console.log(user)
        if (user) {
            req.config.collections.organization.findOne({ _id: req.config.ObjectID(user.orgid) }, function(err, org) {
                user.org = org;
                console.log(org)
                return res.json(user);
            });
        } else {
            return res.json({});
        }
    });
};



/**
 * [deleteUser - delete user by userid]
 * @return {[type]} - Object with status
 */
var deleteUser = function(req, res) {

    var id = req.params.id;
    var user_db = req.config.collections.users;

    user_db.findOne({ "_id": req.config.ObjectId(id), orgid: req.orgid }, function(err, u) {

        if (u) {
            u.deleted = true;
            u.updatedby = req.session.user.userid.toString();
            u.updated = new Date();
            user_db.save(u, function(e, u) {
                return res.json({ status: "success", message: "User deleted successfully." });
            });
        } else {
            return res.json({ status: "success", message: "User delete fail." });
        }
    });
};


var deleteCustomer = function(req, res) {

    var id = req.params.id;

    var usercustomer_db = req.config.collections.usercustomer;

    usercustomer_db.remove({ "_id": req.config.ObjectId(id) }, function(err, eres) {

        res.json({});

    });

};

/**
 * [toggleActive - activate or deactive user by userid]
 * @return {[type]} - Object with status
 */
var toggleActive = function(req, res) {

    var user_db = req.config.collections.users;

    user_db.findOne({ "_id": req.config.ObjectId(req.body.id) }, function(err, user) {
        user.active = req.body.status;
        user.updated = new Date();
        user.updatedby = req.session.user.userid.toString();

        user_db.save(user, function(err, user) {
            res.json({ status: "ok" });
        });

    });
};


var resetPassword = function(req, res) {

    var user_db = req.config.collections.users;
    var userPass = req.body;

    user_db.findOne({ "_id": req.config.ObjectId(req.params.userid) }, function(err, user) {

        user.updated = new Date();
        user.updatedby = req.session.user.userid.toString();

        if (!userPass.hasOwnProperty('password') || !userPass.hasOwnProperty('newPassword') || !userPass.hasOwnProperty('confirmPassword') || userPass.newPassword === '' || userPass.password === '' || userPass.confirmPassword === '') {

            return res.json({ status: "fail", message: "Please enter password." });

        } else if (userPass.hasOwnProperty('password') && user.password !== coreUtil.hash(userPass.password)) {

            return res.json({ status: "fail", message: "Please verify current password." });

        } else if (userPass.newPassword !== userPass.confirmPassword) {

            return res.json({ status: "fail", message: "Confirm Password does not match." });

        } else {

            user.password = coreUtil.hash(userPass.newPassword);

            user_db.save(user, function(err, user) {
                return res.json({ status: "success", message: "Password changes successfully." });
            });
        }
    });
};
var getUserData = function(req,res){

     var user_db = req.config.collections.users;
     user_db.findOne({ orgid: req.orgid },  function(err, users) {
            res.json(users);
     });
};


/* ******** Public methods ******** */
exports.saveUser = saveUser;
exports.getCustomerByUser = getCustomerByUser;
exports.getUsers = getUsers;
exports.getUserDetails = getUserDetails;
exports.deleteUser = deleteUser;
exports.deleteCustomer = deleteCustomer;
exports.toggleActive = toggleActive;
exports.resetPassword = resetPassword;
exports.saveCustomer = saveCustomer;
exports.getUserDetailsByUsername = getUserDetailsByUsername;
exports.getUserData = getUserData;