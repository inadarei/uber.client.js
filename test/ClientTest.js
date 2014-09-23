var chai = require('chai')
    , assert = chai.assert
    , expect = chai.expect
    , should = chai.should();

var client = require('../') //uberclient
  , Message = require('../lib/message').Message
  , u      = require('../lib/util') ;


describe('Client', function(){

  it('should be able to make simple http requests', function(done) {

    //client.authProvider(client.authProviderTokenBased({'token' : 'mytoken'}));
    client.request('http://api.froyo.io', function (error, uberMessage) {
      should.not.exist(error);
      should.exist(uberMessage);

      uberMessage.version.should.equal("1.0");
      uberMessage.format.should.equal("xml");

      var result;

      // Matching a specific link rel
      result = uberMessage.query({"rel" : "urn:froyo_io:query:names"});
      result.should.have.length(1);
      result[0].url.should.equal("/names");

      // Matching a pattern of link rels
      result = uberMessage.query({"rel" : /.*?urn:froyo_io.*?/i});
      result.should.have.length(3);
      result[2].url.should.equal("/pwd");

      done();

    }, "read", "xml"); // Note: api.froyo.io only supports UBER's XML format currently

  });

  it('should be able to parse & query more complex JSON message — the sample on uberhypermedia.org', function(done) {
    var canonicalUrl = 'https://raw.githubusercontent.com/inadarei/uber.client.js/master/test/fixtures/uber-sample.json';
    client.request(canonicalUrl, function(error, uberMsg) {
      should.not.exist(error);
      should.exist(uberMsg);

      uberMsg.data.should.have.length(3);
      uberMsg.data[2].data[0].id.should.equal('people');

      var result;
      result = uberMsg.query({"id" : "people"}).query({"rel" : "http://example.org/rels/create"});
      result[0].action.should.equal("append");
      done();
    });
  });
});

