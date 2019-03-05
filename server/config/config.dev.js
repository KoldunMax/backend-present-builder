var mongojs = require("mongojs");
var ObjectID = require('mongodb').ObjectID;
var core = require("./core.js");

var mongodb = {
    host: "localhost",
    dbname: "presentbuilder",
    port: 27017,
};
var docdb = {
    host: "localhost",
    dbname: "presentbuilder-doc",
    port: 27017
};


var dbconn = mongojs(mongodb.host + "/" + mongodb.dbname);
var docdbconn = mongojs(docdb.host + "/" + docdb.dbname);

var config = {


    mongodb: mongodb,


    getDb: function() {
        return dbconn;
    },

    docdb: docdb,

    getDocDB: function() {
        return docdbconn;
    },

    frontend: 'https://front-present-builder.herokuapp.com', //'https://front-present-builder.herokuapp.com',
    ObjectID: ObjectID,
    ObjectId: ObjectID,
    email: core.email,
    istab: false,
    sessiontime: 30,
    systemDefinedCodeSet: ["COUNTRY", "STATE", "LAYOUT", "CONTENTTYPE", "LOCATION"],
    bitly: {
        enabled: true,
        baseurl: "https://api-ssl.bitly.com",
        tls: true,
        accesstoken: "cd97ac2418c440085fbd94f402c8849692269513",
        tls: { ciphers: "SSLv3" }
    },
    collections: { //all collections
        users: dbconn.collection("users"),
        clients: dbconn.collection("clients"),
        session: dbconn.collection("user_session"),
        documents: dbconn.collection("documents"),
        groups: dbconn.collection("groups"),
        groupitems: dbconn.collection("groupitems"),
        emaillogs: dbconn.collection("emaillogs"),
        unsubscribed_emails: dbconn.collection("unsubscribed_emails"),
        role: dbconn.collection("role"),
        emailsetting: dbconn.collection("emailsettings"),
        usercustomer: dbconn.collection("usercustomer"),
        templates: dbconn.collection("templates"),
        presentations: dbconn.collection("presentations"),
        slides: dbconn.collection("slides"),
        slidecontent: dbconn.collection("slidecontent"),
        menus: dbconn.collection("menus"),
        organization: dbconn.collection("organization"),
        payments: dbconn.collection("payments"),
        plans: dbconn.collection("plans"),
        subscribeplans: dbconn.collection("plan_subscription"),
        recentactivity: dbconn.collection("recentactivity"),
        email_queue: dbconn.collection("email_queue"),
        google_tokens: dbconn.collection("google_tokens"),
        gotomeeting: dbconn.collection("gotomeeting"),
        meetings: dbconn.collection("meetings"),
        emailtemplates: dbconn.collection("email_templates"),
        contact: dbconn.collection("contact"),
        insertmodule: dbconn.collection("insertmodule")
    },
    braintree: {
        //environment: braintree.Environment.Sandbox,
        isProduction: false,
        merchantId: "6vhfzc8frkywbx8y",
        publicKey: "hk7nhb724twzng2n",
        privateKey: "dd4134c8e72ad8b74f0ca1c3af520403"
    },
    encryptor_key: "171Xxi4mY171Xxi4mY171Xxi4mY171Xxi4mY",
    tempdir: "/tmp",

    isValidId: function(str) {

        str = str + '';
        var len = str.length,
            valid = false;
        if (len == 12 || len == 24) {
            valid = /^[0-9a-fA-F]+$/.test(str);
        }
        return valid;

    },
    // phantomjs: '/usr/local/src/environment/presentation-builder/backend/node_modules/phantomjs/bin/phantomjs',
    phantomjs: '/usr/local/src/phantomjs/bin/phantomjs',
    googleAuth: {
        appId: '465886296598-pmhohk3jrmno4f6q5ba41i0llu3h0sca.apps.googleusercontent.com', //ClientId
        appSecret: '_f93yhh6UbXrXnYJU_aQuji7' //ClientSecreat
    },
    gotomeeting: {
        consumerkey: 'Hpk3urX5phoYcKgKX8Ina3FrFZHOuLDT',
        consumersecret: 'wpIZyx26GY1v52ZS',
        appurl: 'http://back.spitballdsd.net',
        apiurl: 'https://api.citrixonline.com'
    },
    appurl: 'http://page-back.winscorewin.net'


};


module.exports = config;