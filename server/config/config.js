var mongojs = require("mongojs");
var ObjectID = require('mongodb').ObjectID;
var core = require("./core.js");
var path = require("path");


var dbconn = mongojs("mongodb://KoldunMax:qwerty123@cluster0-shard-00-00-m1s1a.mongodb.net:27017,cluster0-shard-00-01-m1s1a.mongodb.net:27017,cluster0-shard-00-02-m1s1a.mongodb.net:27017/presentbuilder?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true");
var docdbconn = mongojs("mongodb://KoldunMax:qwerty123@cluster0-shard-00-00-m1s1a.mongodb.net:27017,cluster0-shard-00-01-m1s1a.mongodb.net:27017,cluster0-shard-00-02-m1s1a.mongodb.net:27017/presentbuilder-doc?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true");


var config = {
    // mongodb: mongodb,
    frontend: 'https://front-present-builder.herokuapp.com',

    getDb: function() {
        return dbconn;
    },

    // docdb: docdb,

    getDocDB: function() {
        return docdbconn;
    },


    ObjectID: ObjectID,
    ObjectId: ObjectID,
    email: core.email,

    sessiontime: 30,
    systemDefinedCodeSet: ["COUNTRY", "STATE", "LAYOUT", "CONTENTTYPE", "LOCATION"],
    istab: false,
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
        subscribeplans: dbconn.collection("subscription"),
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
    tempdir: "/app/documents",
    //  tempdir: path.join(__dirname+"../../../documents").replace(/\\/g, '\/').split(":")[1],
    // tempdir: "/ITProjects/presentation-builder-master/backend/dist/documents",
    isValidId: function(str) {

        str = str + '';
        var len = str.length,
            valid = false;
        if (len == 12 || len == 24) {
            valid = /^[0-9a-fA-F]+$/.test(str);
        }
        return valid;

    },
   // phantomjs: 'E:/software/phantomjs-2.1.1-windows/bin/phantomjs.exe',
    //phantomjs: 'C:/software/phantomjs-2.1.1-windows/bin/phantomjs.exe',
    phantomjs: '/app/phantomjs-2.1.1-windows/bin/phantomjs.exe',
    //phantomjs: 'E:/ITProjects/presentation-builder-master/phantomjs-2.1.1-windows/bin/phantomjs.exe',

    googleAuth: {
        appId: '465886296598-pmhohk3jrmno4f6q5ba41i0llu3h0sca.apps.googleusercontent.com', //ClientId
        appSecret: '_f93yhh6UbXrXnYJU_aQuji7' //ClientSecreat
    },
    gotomeeting: {
        consumerkey: 'Hpk3urX5phoYcKgKX8Ina3FrFZHOuLDT',
        consumersecret: 'wpIZyx26GY1v52ZS',
        appurl: 'http://localhost:9000',
        apiurl: 'https://api.citrixonline.com'
    },
    appurl: 'http://localhost:9000',
    childProcessOptions: {
        stdio: "pipe"
    }
};

module.exports = config;