/*global describe,it*/

var chai = require('chai')
  , expect = chai.expect
  , should = chai.should();

var client = require('../') //uberclient
  , u      = require('../lib/util') ;


describe('Util', function(){

  it('should be able to map an UBER action to HTTP method', function() {
    var httpMethod;

    httpMethod = u.action2HttpMethod('read');
    httpMethod.should.equal("GET");

    httpMethod = u.action2HttpMethod('remove');
    httpMethod.should.equal("DELETE");

    httpMethod = u.action2HttpMethod('replace');
    httpMethod.should.equal("PUT");

    httpMethod = u.action2HttpMethod('partial');
    httpMethod.should.equal("PATCH");

    httpMethod = u.action2HttpMethod('append');
    httpMethod.should.equal("POST");

    // wrong one defaults to GET
    httpMethod = u.action2HttpMethod('cooking');
    httpMethod.should.equal("GET");
  });

  it('should be able to translate serialization format type into corresponding UBER mime type string', function() {
    u.selectMimeType("xml").should.equal(u.uberMediaTypeXML);

    u.selectMimeType("json").should.equal(u.uberMediaTypeJSON);

    u.selectMimeType("unknown").should.equal(u.uberMediaTypeJSON);
  });

  it('should be able to detect successful HTTP response codes', function() {
    var goodCodes = [200, 201, 202, 204, 206, 300, 301, 302, 303, 304, 305, 307];
    goodCodes.forEach(function(code, idx) {
      u.isHttpSuccess(code).should.equal(true);
    });

    var sampleBadCodes = [400,500,100];
    sampleBadCodes.forEach(function(code, idx) {
      u.isHttpSuccess(code).should.equal(false);
    });
  });
});

