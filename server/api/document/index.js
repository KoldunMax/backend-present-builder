'use strict';

var express = require('express');
var controller = require('./document.controller');

var pdfController = require('./pdf.controller');

var router = express.Router();
 

 router.get("/pub/logo/:emailid", controller.getLogo);
 router.get("/pub/email/:emailid", controller.getEmailId);
 router.post("/pub/email/unsubscribe/:emailid", controller.unsubscribeEmail);



router.get('/contextid/:contextid/contexttype/:contexttype/doctype/:doctype/size/:size', controller.getdocument);


router.post('/', controller.index); 
router.get("/:socialid/profile", controller.getProfilePic);

router.get('/pdf/:id', pdfController.generatePDF);



module.exports = router;