var emailapi = require("./emailsender.js");
 
module.exports.send = function (user, cb){

	var body = "Hello Avanish <br />";
	body += "A new user has confirmed account on Website : <b> " + user.username  + "</b>" ;
	body += "<br />" + JSON.stringify (user) ;
	
	/*
   emailapi.sendemail ("avakojha@gmail.com","new user has confirmed : " + user.name, body, function(err, res){
	   
	   
	   if (cb){
		   cb (err, res);
	   }
   });
   
	*/
};