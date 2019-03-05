'use strict';

var express = require('express');
var controller = require('./plan.controller');

var router = express.Router();

router.post('/', controller.savePlan);
router.get('/', controller.getPlans);

router.get('/active', controller.getActivePlans);
router.post('/activate', controller.toggleActive);

router.get('/my', controller.getMyPlans);

router.get('/:id', controller.getPlanById);

router.post('/delete/:id', controller.deletePlan);

router.post('/subscribe', controller.subscribePlan);
router.get('/subscribe/:id', controller.getSubscribePlan);
router.get('/planhistory/:id', controller.getPlanHistory);

router.get('/currentsubscribe/:id', controller.getCurrentSubscribePlan);



module.exports = router;