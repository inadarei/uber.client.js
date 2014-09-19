var after  = require('after')
  , should = require('should')
  , u = require('../lib/util')
  , assert = require('assert');

var client = require('../') //uberclient
u      = require('../lib/util') ;


describe('Client', function(){

  it('should be possible to map an UBER action to HTTP method', function() {
    var http_method = u.action2HttpMethod('read');
    assert.ok(http_method, 'GET');

    var http_method = u.action2HttpMethod('remove');
    assert.ok(http_method, 'DELETE');

    var http_method = u.action2HttpMethod('replace');
    assert.ok(http_method, 'PUT');

    var http_method = u.action2HttpMethod('partial');
    assert.ok(http_method, 'GET');

    var http_method = u.action2HttpMethod('append');
    assert.ok(http_method, 'PATCH');

    // wrong one defaults to GET
    var http_method = u.action2HttpMethod('cooking');
    assert.ok(http_method, 'GET');

  });
});

