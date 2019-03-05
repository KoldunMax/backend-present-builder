var crypto = require ("crypto");
var checkEmail = require('legit');


var generatePassword = require('password-generator');

var hash = function (message){
	 
	var hash = crypto.createHash('sha512');
    hash.update(message);
    return hash.digest('hex');
};


var isValidEmail  = function (email, cb){
	 
	 
	 var splitEmail = email.split('@');
	 if (splitEmail.length <2){
		 cb (false);
		 return;
	 }
	 if (splitEmail[1].indexOf(".")<1){
		 cb (false);
		 return;
	 }
	 checkEmail(email, function(validation, addresses) {
		  
		if (!addresses){
			cb(false);
			return;
		}
		
		 if (addresses.length ==1){
			  
			 if (addresses[0].exchange.indexOf("dns-needs-immediate")>=0){
				 console.log ("returning false");
				 
				 cb(false);
				 return;
			 }else if  (addresses[0].exchange == "") {
			 		 cb(false);
				 return;
			 }
			 	 cb(true);
				 return;
			 
		 }else{
			 cb (true);
		 }
	 });
 };



var register = function (){

  var auth = require ("../../api/user/user.controller.js");
  var req = {
    config : require("../../config/config.js"),
    body : {email : 'avanish.ojha@quicksoftpro.com', username : 'admin',
      password : 'Quick123', name : "Avanish Ojha", firstname : "Avanish", lastname : "Ojha"}
  
  };

  req.session = {};
  req.session.user = {};
  req.session.user.userid = new req.config.ObjectId();

  var res = {
  	json : function (r){
  		console.log (r);
  	}
  };
  
  //auth.saveUser (req, res);

};




var genPass = function() {
    var pass = generatePassword(8, false);
    return pass;
};



//register();




/****************           */

exports.hash = hash;
exports.isValidEmail = isValidEmail;
exports.defregister = register;
exports.genPass = genPass;