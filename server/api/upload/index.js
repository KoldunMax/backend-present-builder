'use strict';

var express = require('express');
var controller = require('./upload.controller');

var router = express.Router();

router.post('/update', controller.updateDocumentDetails);

router.post('/', controller.index); // Upload document based on organizationid and userid
router.get('/', controller.getMyOrganizationDocuments); // Upload document based on organizationid and userid
router.get('/context/:type', controller.getDocumentsByType); // Get document based on document type
router.get('/mycontent', controller.getMyContent);
router.get('/document/:docid', controller.getDocumentById);
router.get('/preview/:docid/:mimetype', controller.getDocPreview);
router.get('/document/:docid', controller.getDocumentById);


//TODO : Remove this afterwards
router.get('/:contextid', controller.getAllDocuments); // Get all document by contextid

router.get('/:contextid/:doctype', controller.getDocumentByDoctype); //uid to get document 

router.get('/:contextid/:doctype/:docid', controller.getDocument);

router.post('/deletedocument/:docid', controller.deleteDocument);

router.post("/chunkupload", controller.chunkUpload);
router.post('/docmuentupload', controller.updateDoctypeDocuments);
router.post('/deletedocumentmycontent/:id', controller.deleteMyContent);
router.post('/delete', controller.deleteDocByType);
router.post('/updatedoc', controller.updateDocHeight);


module.exports = router;