var chai = require('chai')
  , expect = chai.expect
  , should = chai.should();

var client = require('../') //uberclient
    u      = require('../lib/util') ;


describe('Util', function(){

  it('should be able to map an UBER action to HTTP method', function() {
    var http_method = u.action2HttpMethod('read');
    http_method.should.equal("GET");

    var http_method = u.action2HttpMethod('remove');
    http_method.should.equal("DELETE");

    var http_method = u.action2HttpMethod('replace');
    http_method.should.equal("PUT");

    var http_method = u.action2HttpMethod('partial');
    http_method.should.equal("PATCH");

    var http_method = u.action2HttpMethod('append');
    http_method.should.equal("POST");

    // wrong one defaults to GET
    var http_method = u.action2HttpMethod('cooking');
    http_method.should.equal("GET");
  });

  it('should be able to translate serialization format type into corresponding UBER mime type string', function() {
    u.selectMimeType("xml").should.equal(u.uberMediaTypeXML);

    u.selectMimeType("json").should.equal(u.uberMediaTypeJSON);

    u.selectMimeType("unknown").should.equal(u.uberMediaTypeJSON);
  });
});

