'use strict';

var express = require('express');
var controller = require('./client.controller');

var router = express.Router();

router.post('/', controller.saveClient);
router.get('/', controller.getClients);
router.get('/:id', controller.getClientById);
router.get('/identifier/:name', controller.isUniqueClient);
router.post('/delete/:id', controller.deleteClient);


module.exports = router;