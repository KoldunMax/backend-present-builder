'use strict';

var request = require('request');




var checkValidUrl = function(req, res) {


    var url = req.body.url;

    if (url && url != undefined) {
        if (url.indexOf('http://') === -1 && url.indexOf('https://') === -1) {
            url = 'http://' + url;
        }

        request(url, function(error, response, body) {
            // console.log(response.statusCode);
            if (!error && response.statusCode == 200) {
                res.json(response.statusCode); // Show the HTML for the Google homepage.
            } else {
                res.json(404);
            }
        })

    } else {
        res.json(404);
    }




};



exports.checkValidUrl = checkValidUrl;