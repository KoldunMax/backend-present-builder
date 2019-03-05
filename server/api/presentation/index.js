"use strict";

var express = require("express");
var controller = require("./presentation.controller");

var router = express.Router();

router.post("/", controller.savePresentation);
router.get("/", controller.getPresentations);
router.get("/recent", controller.getRecentPresentations);
router.get("/list", controller.getPresentationList);
router.post("/copypresentation", controller.copyPresentation);
router.post("/activate", controller.toggleActive);
router.get("/:id", controller.getPresentationById);
router.get(
    "/presentationcode/:presentationurl",
    controller.getPresentationCode
);
router.get("/client/:clientid", controller.getPresentationByClientId);
router.post("/delete/:id", controller.deletePresentation);
router.get("/:id/slides", controller.getSlides);
router.post("/url", controller.getPresentationUrl);
router.post("/userdetail/:presentationid", controller.saveUserDetails);
router.post("/sendmail/:presentationid", controller.sendMail);
router.get("/identifier/:name", controller.isUniquePresentation);
router.post("/urls", controller.getPresentationsUrl);

module.exports = router;