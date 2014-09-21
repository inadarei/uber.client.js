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
    client.request('http://api.froyo.io', function (error, msg) {
      if (!error) {
        var result, json;

        // Matching a specific link rel
        result = msg.query({"rel" : "urn:froyo_io:query:names"});
        result.should.have.length(1);
        result[0].url.should.equal("/names");

        // Matching a pattern of link rels
        result = msg.query({"rel" : /.*?urn:froyo_io.*?/i});
        result.should.have.length(3);
        result[2].url.should.equal("/pwd");

        done();
      }
    }, "read", "xml"); // Note: api.froyo.io only supports UBER XML currently

  });

});

