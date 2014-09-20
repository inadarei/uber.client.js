var client = require('../') //uberclient
  , u      = require('../lib/util') ;


describe('Client', function(){

  it('should be able to make simple http requests', function(done) {

    //client.authProvider(client.authProviderTokenBased({'token' : 'mytoken'}));
    client.request('http://api.froyo.io', function (error, message) {
      if (!error) {
        // do something with message
        console.log(JSON.stringify(message));
        done();
      }
    }, "read", "xml");

  });

});

