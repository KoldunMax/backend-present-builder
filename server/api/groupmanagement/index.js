'use strict';

var express = require('express');
var controller = require('./groupmanagement.controller');

var groupitem = require('./groupitem.controller');
var autoupdate = require('./autoupdate.controller'); 

var router = express.Router();

router.get('/', controller.index);
router.post('/', controller.save);
router.post('/remove', controller.delete);
router.get('/:type',controller.getgroupbytype);
router.get('/groupitem/:groupid', groupitem.index);

router.get('/group/:code/items', groupitem.getbygroupcode);

router.post('/groupitem', groupitem.save);
router.post('/groupitem/remove', groupitem.delete);


router.post('/autoupdate', autoupdate.update);
router.get('/myip', autoupdate.myip); 

module.exports = router;