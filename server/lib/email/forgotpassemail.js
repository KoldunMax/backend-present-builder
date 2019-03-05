 var emailapi = require("./emailsender.js");

var send = function (user, cb){

	var model = {USERNAME : user.username, 
			RECEIVER_NAME : user.name , 
				PASSWORD : user.password};
	 
 
	
   emailapi.sendTemplate (user.email, "Your passsword for account", "./template/forgotpassword.html", model, function(err, res){
	   
	    
	   if (cb){
		   cb (err, res);
	   }
   });
   
	
};


exports.send = send;



//send ({username : 'avakojha@gmail.com', name : 'Avanish', password: "xxxx"});
