/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var multer = require('multer');
var express = require('express');
var config = require('./config/environment');
 
// Setup server
var app = express();
var server = require('http').createServer(app);
require('./config/express')(app);  


require ('./lib/interceptor/auth.js')(app);
require ('./lib/interceptor/authorization.js')(app);
app.use (multer());

require('./routes')(app);

// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));

  require("./lib/util/coreutil.js").defregister();
});

 

 

// Expose app
exports = module.exports = app;