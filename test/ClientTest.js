var client = require('../') //uberclient
  , Message = require('../lib/message').Message
  , u      = require('../lib/util') ;


describe('Client', function(){

  it.only('should be able to make simple http requests', function(done) {

    //client.authProvider(client.authProviderTokenBased({'token' : 'mytoken'}));
    client.request('http://api.froyo.io', function (error, msg) {
      if (!error) {
        var result;
        result = msg.query({"rel" : "urn:froyo_io:query:names"});
        result = msg.query({"rel" : /.*?query:names.*?/i});
        done();
      }
    }, "read", "xml");

  });

});

