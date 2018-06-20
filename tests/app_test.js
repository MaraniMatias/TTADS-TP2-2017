"use strict";
var server = require('../server'),
  chai = require('chai'),
  chaiHTTP = require('chai-http'),
  should = chai.should();

chai.use(chaiHTTP);

var reqServer = process.env.HTTP_TEST_SERVER || server;

describe('Basic routes tests', function () {

  it('GET to /status should return 200', function (done) {
    chai.request(reqServer)
      .get('/status')
      .end(function (err, res) {
        res.should.have.status(200);
        done();
      });
  });

});
