var emailapi = require("./emailsender.js");
 
var send = function (user, cb){

 	var model = {};
	model.RECEIVER_NAME = user.firstname + " " + user.lastname;
	model.PASSWORD = user.password;
	model.USERNAME = user.username;
	  	
	   emailapi.sendTemplate (user.email, "Welcome", "./template/welcome.html", model, function(err, res){
		   
		   if (cb){
			   cb (err, res);
		   }
	   });
	 //  adminEmail.send (user, function(){});
	
};


exports.send = send; 

//for testing.
//send ({name: 'Amol', username: 'amolborse699@gmail.com'});