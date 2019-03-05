'use strict';

var express = require('express');
var controller = require('./braintree.controller');

var router = express.Router();


router.get('/clienttoken', controller.getClientToken);
router.post('/checkout', controller.savePayment);

/******************** Public Functions **************/
module.exports = router;