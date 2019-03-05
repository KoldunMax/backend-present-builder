

var request = require("request");


var saveEmail = function(config,emailsetting,cb){
	
	if (emailsetting.name === null || emailsetting.name.trim().length === 0){
			res.json ({error: 'invalid EMAIL SETTING name '});
			return;
	}

  	if (emailsetting._id){
  		emailsetting._id = config.ObjectID (emailsetting._id);
  	}


    config.collections.emailsetting.save (emailsetting, function (e, r){
		console.log (e);
		 return cb (r);
	});


};

exports.saveEmail = saveEmail;