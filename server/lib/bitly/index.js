var config = require('../../config/config.js');
var request = require ("request");

 
/*[shorten function shortens the long url]
 *@param {[longUrl]} [url which is to be shorten]
 *return callback
 */
var shorten = function (longUrl , cb){
	
	if (!config.bitly.enabled){
		return cb (null, longUrl);
	}

	var url = config.bitly.baseurl + "/v3/shorten?access_token=" + config.bitly.accesstoken +
					"&longUrl=" + encodeURIComponent (longUrl);
	var options = {
		url : url,
		agentOptions: {
        securityOptions: 'SSL_OP_NO_SSLv3'
      }
	};
	 request (options, function (err, res, body){

	
	 	 if (body){
	 	 	body = JSON.parse (body);
	 	 }
        
	 	if (body && body.data.url){
	 		return cb (null, body.data.url);
	 	}
	 	return cb (null, longUrl);
	 });
};

/*************public function************/
exports.shorten = shorten;

// shorten("http://page-back.winscorewin.net/presentation/manrique-group/quicksoft-pro/quick-presentation",function(err,res){
//     console.log("test",res);
// });


