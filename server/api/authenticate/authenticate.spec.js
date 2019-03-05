'use strict';

var should = require('should');
//var app = require('../../app');
var request = require('supertest');
var config = require("../../config/config.js");

var res = {
    json: function(a) {
        console.log(a);
    }
};

/*
describe('GET /api/authenticates', function() {

  it('should respond with JSON array', function(done) {
    request(app)
      .get('/api/authenticates')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        done();
      });
  });
});

*/

var register = function() {

    var auth = require("../user/user.controller.js");
    var req = {
        config: config,

        body: {
            email: 'avanish.ojha@quicksoftpro.com',
            username: 'admin',
            password: 'Quick123',
            name: "Avanish Ojha",
            firstname: "Avanish",
            lastname: "Ojha",
            companyname : "Quicksoftpro",
            assignrole : 'admin'
        }

    };
    req.session = {};
    req.session.user = {};
    req.session.user.userid = new config.ObjectId();
    auth.saveUser (req, res);

    var loader = require("../../lib/loader/import-group.js");
    loader.load ("../../data/group.json");
};

register ();//



var login = function() {

    var auth = require("./authenticate.controller.js");
    var req = {
        config: config,
        body: {
            username: 'avanish.ojha@quicksoftpro.com',
            password: 'Quick123'
        }

    };



    auth.index(req, res);

};


//login ();
