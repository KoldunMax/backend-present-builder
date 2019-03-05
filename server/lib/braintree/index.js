var braintree = require('braintree');
var config = require('../../config/config.js');
var encryptor = require('simple-encryptor')(config.encryptor_key);
var gateway = braintree.connect({
    environment: config.braintree.isProduction ? braintree.Environment.Production : braintree.Environment.Sandbox,
    merchantId: config.braintree.merchantId,
    publicKey: config.braintree.publicKey,
    privateKey: config.braintree.privateKey
});


var getClientToken = function (cb) {

    gateway.clientToken.generate({}, function (err, response) {

        if (err) {
            return cb(err, null);
        }

        return cb(null, response.clientToken);
    });
};

var savePayment = function (data, cb) {

    createCustomer(data, function (err, cust) {

        if (err) {
            return cb(err, null);
        }

        if (!cust.success) {
            return cb(err, cust);
        }

        data.payment_method_token = cust.customer.paymentMethods[0].token;

        gateway.transaction.sale({
            amount: data.amount,
            paymentMethodToken: data.payment_method_token //'fake-valid-nonce', //for testing

        }, function (err, result) {
            if (err) {

                return cb(err, null);
            }
            if (result.errors) {

                return cb(null, result);
            }
            
            data.payment_method_token = encryptor.encrypt(data.payment_method_token);
            
            var paymentData = {
                amount: data.amount,
                userid: data.userid,
                payment_method_token: data.payment_method_token
            }

            config.collections.payments.save(paymentData, function (err, response) {

                return cb(null, result);

            });

           
        });
    });

};


var createCustomer = function (data, cb) {

    config.collections.users.findOne({ _id: config.ObjectID(data.userid) }, function (err, user) {

        gateway.customer.create({
            firstName: user.firstname,
            lastName: user.lastname,
            email: user.email,

            creditCard: {
                paymentMethodNonce: data.payment_method_nonce,
                options: {
                    verifyCard: true
                }
            }

        }, function (err, result) {

            return cb(null, result);
        });
    });

};



exports.getClientToken = getClientToken;
exports.savePayment = savePayment;