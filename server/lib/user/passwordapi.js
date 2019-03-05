 var emailApi = require("../email/forgotpassemail.js");
var utilApi = require ("../util/coreutil.js");



 module.exports.forgotpassword = function(config, username, cb) {
    username = username.toLowerCase();

     var users_db = config.collections.users;
 
      
     users_db.findOne({ username : username, }, function(e, u) {
     
         if (u) {
             console.log("Sending email .........");

             //we do not know the password .
             //lets reset it ..
             var pass = utilApi.genPass ();
             u.password  = utilApi.hash (pass);

             users_db.save (u, function (e, saveduser){
                saveduser.password = pass;
                emailApi.send(saveduser);

                cb(null,{ status: "success", 
                    message: "New password has been sent to your email - " + saveduser.email 
                + ". If you do not receive it, please check your spam folder." });

             });


         } else {
             cb(null,{ status: "fail", message: "Invalid username" });
         }

     });



 };
