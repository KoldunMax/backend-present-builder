'use strict';
var bitlyLib = require('../../lib/bitly/index.js');

var config = require('../../config/config.js');

/**
 * [shorten function gets shorten url]
 * @return {[string]}  [shorten url]
 */
var shorten = function(req, res) {

    var redirecturl = req.body.url;


    bitlyLib.shorten(redirecturl, function(e, r) {

        res.json({ "long_url": redirecturl, "shorten_url": r });

    });

};



/**
 * [shorten function gets shorten url]
 * @return {[string]}  [shorten url]
 */
var shortenImageUrl = function(req, res) {


    var redirecturl = config.appurl + req.body.url;

    bitlyLib.shorten(redirecturl, function(e, r) {
        if (e) {
            res.json({ "long_url": redirecturl, "shorten_url": redirecturl });
        } else {
            res.json({ "long_url": redirecturl, "shorten_url": r });
        }


    });

};

exports.shorten = shorten;
exports.shortenImageUrl = shortenImageUrl;