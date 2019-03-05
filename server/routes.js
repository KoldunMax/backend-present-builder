/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');

module.exports = function(app) {

    // Insert routes below 
    app.use('/api/users', require('./api/user'));
    app.use('/api/documents', require('./api/document'));
    app.use('/api/roles', require('./api/role'));
    app.use('/api/authenticate', require('./api/authenticate'));
    app.use('/api/groupmanagements', require('./api/groupmanagement'));
    app.use('/api/upload', require('./api/upload'));
    app.use('/api/templates', require('./api/template'));
    app.use('/api/presentations', require('./api/presentation'));
    app.use('/api/slides', require('./api/slide'));
    app.use('/api/slidecontents', require('./api/slidecontent'));
    app.use('/api/menus', require('./api/menu'));
    app.use('/api/clients', require('./api/client'));
    app.use('/api/organizations', require('./api/organization'));
    app.use('/api/frontend/builders', require('./api/builder'));
    app.use('/api/emailsettings', require('./api/emailsetting'));
    app.use('/api/bitly', require('./api/bitly'));
    app.use('/api/braintree', require('./api/braintree'));
    app.use('/api/plans', require('./api/plan'));
    app.use('/api/recentactivity', require('./api/recentactivity'));
    app.use('/api/email', require('./api/email'));
    app.use('/api/gotomeeting', require('./api/gotomeeting'));
    app.use('/api/meetings', require('./api/meeting'));
    app.use('/api/contact', require('./api/contact'));
    app.use('/api/url', require('./api/url'));
    app.use('/api/insertmodule', require('./api/insertmodule'));

    // All undefined asset or api routes should return a 404
    app.route('/:url(api|auth|components|app|bower_components|assets)/*')
        .get(errors[404]);

    // All other routes should redirect to the index.html
    app.route('/*')
        .get(function(req, res) {
            res.sendfile(app.get('appPath') + '/index.html');
        });
};