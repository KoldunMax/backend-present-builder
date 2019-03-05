'use strict';

var express = require('express');
var controller = require('./user.controller');

var router = express.Router();

router.post('/', controller.saveUser);
router.get('/', controller.getUsers);
router.get('/customerlist/:userid', controller.getCustomerByUser);
router.post('/customer', controller.saveCustomer);
router.post('/:userid/password', controller.resetPassword);
router.post('/delete/:id', controller.deleteUser);
router.post('/deleteCustomer/:id', controller.deleteCustomer);
router.post('/activate', controller.toggleActive);
router.get('/userrole/:username', controller.getUserDetailsByUsername);
router.get('/:userid', controller.getUserDetails);
router.get('/data/:id', controller.getUserData);
module.exports = router;