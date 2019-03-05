var config = require("../../config/config.js");
var request = require("request");



var getAccessToken = function(code,cb) {
	 
    var url = config.gotomeeting.apiurl + "/oauth/access_token";
    url += "?grant_type=authorization_code";
    url += "&code=" +  code ;
    url += '&client_id='+config.gotomeeting.consumerkey;
    console.log ("<<<>>>>>>>", url);
  request (url, function(e, r, b){


    console.log (e, b);

    if (b){
        b = JSON.parse (b);
    }

    return cb (e,b);
  });
     
};


 var save = function (context, gtm, cb){
    var userid = context.user.userid;

    var db = context.config.collections.gotomeeting;
    db.findOne({userid: userid}, function (e, r){
        if (e || !r){
            r = {};
            r.created = new Date();
            r.userid = userid;
        }

        r.gtm = gtm;

        db.save (r, function (){
            return cb (r);
        });


    });
 };


var auth = function (context, cb){
    console.log (">>>>>>" , context);

    getAccessToken (context.query.code, function (e, r){
        if (e){
            return cb ({status: "error", err : e});
        }

        if (r.ErrorCode){
            return cb ({status: "error", err : r});
        }

        save (context, r , function (d){
             return cb (d);
        });
       
    });
    /*
    { _id: 590d3ab03d75a4fab9b12759,
  user: 
   { userid: 5885e21fc55a2e252058aa6a,
     username: 'admin',
     orgid: '5885e21fc55a2e252058aa69',
     role: 
      { _id: '58cd0b7e2f3ad0325cde2da4',
        created: '2017-03-18T10:27:46.504Z',
        groupid: '58cd0b652f3ad0325cde2d9c',
        code: 'ADMIN',
        name: 'Admin',
        active: true,
        orgid: null },
     email: 'avanish.ojha@quicksoftpro.com' },
  created: 2017-05-06T02:53:36.221Z,
  expires: 2017-05-06T03:47:01.957Z,
  active: true,
  token: '590d3ab03d75a4fab9b12759',
  isadmin: false,
  body: {},
  query: 
   { token: '590d3ab03d75a4fab9b12759',
     scope: '',
     code: 'eecc3799' } }
*/
    
};


exports.auth  = auth;
