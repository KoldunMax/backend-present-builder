

var email ={
		user:"hangout@quicksoftpro.com", 
		password:"Quick123", 
		host:    "smtp.quicksoftpro.com", 
		from : "Spitball DSD <hangout@quicksoftpro.com>",
		ssl:  false,
		port: 2225
	};

	var email2 = {
		user:    "info@hangout.quicksoftpro.com", 
		password:"Quick123", 
		host:    "mx.hangout.quicksoftpro.com", 
		tls:     true,
		port: 587,
		from : "Spitball DSD <info@hangout.quicksoftpro.com>",
		tls: {ciphers: "SSLv3"}
	};

	var email3 = {
		user:    "admin@winscorewin.com", 
		password:"Vikings1", 
		host:    "smtpmail.visi.com", 
		from : "Spitball DSD <info@quicksoftpro.com>",
		tls: {ciphers: "SSLv3"}
	};

	var emailx = {
		 
		host:    "mailout.serverpronto.com", 
		from : "Spitball DSD <info@quicksoftpro.com>",
		port: 25
	};


var core = {
	email : email

};

module.exports = core;