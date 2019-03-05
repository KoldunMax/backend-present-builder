var config = require ("../../config/config.js");
var profiledb = config.collections.profile;
var userdb = config.collections.users;
var async = require ("async");

var registerApi =  require ("../user/register.js");

//test it on socialid : kimmarquez

var fix =function(){

	profiledb.find({email: {$exists: false}}, function (err, profiles){
	//profiledb.find({socialid: 'roxy'}, function (err, profiles){

		var index = 1;
		var total = profiles.length;

		async.eachSeries (profiles, function(profile, cb){

			userdb.findOne({name : profile.socialid}, function (err, user){
				if (user){
				autoVerify (user.username, user.password, function (){
					console.log ("[" + index++ + "/" + total  + "] verified  : " + user.username);
					cb (null, user.username);
				});
				}else{
					cb(null, "invalid");
				}
			});

		}, function (err, res){
			console.log ("Finished with all emails");
			 
		});

	});

};


var autoVerify =function(email, password, cb){
		registerApi.verifyaccount (config, email, password, "1000", function (err, r){
			 
			cb (null, "done");
		});
};



fix ();
