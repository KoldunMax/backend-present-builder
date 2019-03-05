var config = require('../../config/config.js');
var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var _ = require('lodash');
var moment  = require ("moment");

var getLogin = function(req, redirect_uri, reconnect, cb) {

    
    var oauth2Client = new OAuth2(
        config.googleAuth.appId,
        config.googleAuth.appSecret,
        redirect_uri
        
    );
    // generate a url that asks permissions
    var scopes = ['openid', 'email', 'https://www.googleapis.com/auth/calendar'];

    //if refresh token present get event list or send login url
    req.config.collections.google_tokens.findOne({ userid: req.session.user.userid.toString() }, function(err, response) {
       // console.log("resss", response);
        if (err) {
            console.log("Error :: ", err);
        }
        if (reconnect){
            var url = oauth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: scopes,
                prompt: 'consent'
            });
            console.log ("url is ...", url);
            return cb(null, { loginurl: url });
        }
        if (!response) {
            var url = oauth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: scopes,
                prompt: 'consent'
            });
            console.log ("url is ...", url);
            return cb(null, { loginurl: url });
        } else {
            //Set refresh token to oauth2Client
            oauth2Client.setCredentials({
                refresh_token: response.refresh_token
            });

            oauth2Client.refreshAccessToken(function(err, tokens) {
                
               // console.log ("***result of rfresh token query ...", tokens);

                tokens._id = response._id;
                oauth2Client.setCredentials({
                    access_token: tokens.access_token,
                    refresh_token: tokens.refresh_token
                });
                saveRefreshToken(tokens, req, function() {
                    listEvents(oauth2Client, function(err, events) {
                        if (err) {
                            return cb(err, { events: [] });
                        }
                        return cb(null, { events: events });
                    });
                });
            });

        }


    });

};


var exchangeToken = function(req, redirect_uri, google_code, cb) {
    
        var oauth2Client = new OAuth2(
            config.googleAuth.appId,
            config.googleAuth.appSecret,
            redirect_uri
        );
    
        oauth2Client.getToken(google_code, function(err, tokens) {
    
            //Now tokens contains an access_token and an optional refresh_token.
            if (!err) {
                oauth2Client.setCredentials(tokens);
            }
    
            if (err) {
                return cb(err, null);
            }
    
            //Save refresh token token details 
            saveRefreshToken(tokens, req, function() {
                return cb ();
            });
        });
    };
    


var getGoogleCalenderAgenda = function(req,   cb) {

    var oauth2Client = new OAuth2(
        config.googleAuth.appId,
        config.googleAuth.appSecret
         
    );

    config.collections.google_tokens.findOne ({userid: req.session.user.userid.toString()}, function (e, tokens){
        console.log ("tring to ge this user ..", req.session.user.userid);
        if (!tokens){
            console.log ("no token ...");
              return cb(null, { events: [] });
        }

      //  console.log ("looking into google", tokens);
            oauth2Client.setCredentials({
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token});

            listEvents(oauth2Client, function(err, events) {
                //console.log ("google sas ...");
              ///  console.log (err, events);
                if (err) {
                    return cb(err, { events: [] });
                }
                return cb(null, { events: events });
            });
        });
        
};

function saveRefreshToken(tokens, req, cb) {
     
    var data = {
        userid: req.session.user.userid.toString(),
        access_token: tokens.access_token,
        id_token: tokens.id_token,
        refresh_token: tokens.refresh_token,
        token_type: tokens.token_type,
        expiry_date: tokens.expiry_date,
    };

    var id = tokens._id;

    if (typeof id !== 'undefined') {
        data._id = req.config.ObjectID(id);
        data.updatedon = new Date();
    } else {
        data.createdon = new Date();
        data.updatedon = new Date();
    }
    var db = req.config.collections.google_tokens;
    db.findOne ({userid: data.userid}, function (e, r){
        if (!r){
            r = {};
            r.createdon = new Date ();
            r.userid = data.userid;
        }
        r.access_token = data.access_token;
        r.id_token = data.id_token;
        r.refresh_token = data.refresh_token;
        r.token_type = data.token_type;
        r.expiry_date = data.expiry_date;

        console.log ("*** I A SAVING AUTH DATA >>>>");

        db.save (r, function (e, saved){
            return cb ();
        });
        

    });
  
};

/**
 * Lists the next 50 events on the user's primary calendar.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listEvents(auth, cb) {

    var calendar = google.calendar('v3');

    calendar.events.list({
        auth: auth,
        calendarId: 'primary',
        //timeMax: (new Date()).toISOString(),
     
        //singleEvents: true,
       // orderBy: 'startTime'

       timeMin: (new Date()).toISOString(),
       maxResults: 20,
       singleEvents: true,
       orderBy: 'startTime'

    }, function(err, response) {
       // console.log ("response from google ...", err, response);
        if (err) {

            return cb(err, []);
        }
        var events = response.items;

        if (events.length == 0) {

            return cb(null, []);
        } else {

            var upcomingEvents = _.filter(events, function(data) {
                return data.start.dateTime >= (new Date()).toISOString()
            });

            return cb(null, upcomingEvents);
        }
    });
};



var getMonthCalendar  = function (config, user, month, year, cb){
   // console.log ("monthly calendar called....", user);
    config.collections.google_tokens.findOne ({userid: user.userid.toString()}, function (e, token){
       // console.log ("error check ...", e, token);
        
        if (e || !token){
            return cb ([]);
        }

        var oauth2Client = new OAuth2(
            config.googleAuth.appId,
            config.googleAuth.appSecret
        );

        oauth2Client.setCredentials({
            access_token: token.access_token,
            refresh_token: token.refresh_token,
        });


        var calendar = google.calendar('v3');
        var dateStart  = moment ().year (year).month (month).date (1);
        var dateEnd =  moment(dateStart).add(2, 'M');
        var opts = {
            auth: oauth2Client,
            calendarId: 'primary',
            timeMax: dateEnd.toISOString(),  
            timeMin: dateStart.toISOString (),
            singleEvents: true
           //orderBy: 'startTime'
    
        };

     
        calendar.events.list(opts, function (e, r){
           // console.log ("*** events from curren tmonth ...",e,  r);

             if(r && r.items){
                for  (var i=0; i<r.items.length; i++){
                    r.items[i].title =  r.items[i].summary; 
                    //console.log ("i :"  + i + " > "  , r.items[i].start );
                    r.items[i].start = moment (r.items[i].start.date || r.items[i].start.dateTime);//.format ("YYYY-MM-DD");
                    //r.items[i].end = moment (r.items[i].end).format ("YYYY-MM-DD"); 
                    r.items[i].end = moment (r.items[i].end.date || r.items[i].end.dateTime);//.format ("YYYY-MM-DD");
                    
                }
        }
            return cb (r);
        });

    });
};

exports.getLogin = getLogin;
exports.getGoogleCalenderAgenda = getGoogleCalenderAgenda;
exports.getMonthCalendar = getMonthCalendar;
exports.exchangeToken = exchangeToken;
 