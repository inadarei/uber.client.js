var after  = require('after')
  , should = require('should')
  , assert = require('assert');

var client = require('../') //uberclient
u      = require('../lib/util') ;


describe('Client', function(){
  it('should be able to make initial, simple, unauth request', function(done) {

    var options = {
      url: 'http://api.froyo.io',
      headers: { 'Accept': u.uberMediaTypeXML }
    };

    client.request(options, function (error, message) {
      if (!error) {
        console.log(message.raw());
      } else {
        console.log(error);
      }

      assert.ok(true);

      done();
    });

  })
});