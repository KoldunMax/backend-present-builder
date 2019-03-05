var braintree = require('../../lib/braintree/index.js');

var getClientToken = function(req, res) {

    console.log("in client token");
  
   
    braintree.getClientToken(function(err, token) {

        if (err) {
            return res.app.dynamicError(err, res);
        }
        console.log("==========================", token);
        return res.json({ "token": token });
    });

};

var savePayment = function(req, res) {


    console.log("===========================", req.session);
    console.log("req.boy", req.body);
    var data = req.body;
    data.userid = req.session.user.userid;
    braintree.savePayment(req.body, function(err, resp){


        if (err) {
            return res.app.dynamicError(err, res);
        }
    console.log("err", err);
    console.log("resp", resp);
        return res.json(resp);


    });
    

};


/**************public functions***************/
exports.getClientToken = getClientToken;
exports.savePayment = savePayment;


