'use strict';

var _ = require('lodash');
var async = require("async");
var config = require("../../config/config.js");

 var getRecentActivity = function(req,res){
      


  //return activity type : presentation , email, meeting
      var db = req.config.collections.recentactivity;
      db.find({objecttype: 'presentation'}, {presentation_id: 1})
      .sort ({activity_date: -1})
      .limit (5, function (e, doc){

        var response = [];

        async.forEach(doc, function(activity, callback) {
          
         req.config.collections.presentations.findOne({ "_id": config.ObjectId(activity.presentation_id) }, function(err, present) {
              
            response.push (present);
            callback ();

                
            });

         }, function() {
         
           return res.json(response);

         });
     


      });

       
 };


 exports.getRecentActivity = getRecentActivity;



