var after  = require('after')
  , should = require('should')
  , assert = require('assert');

var message = require('../lib/message');


describe('Uber Message class', function() {
  describe('rawFormat() function', function() {
    it('should be able properly detect XML message format', function() {
      var xml = " <uber version=\"1.0\">\n<data>blah</data>\n</uber>";
      var msg = message(xml);
      assert.equal(msg.rawFormat(), "xml");
    });

    it('should be able properly detect JSON message format', function() {
      var xml = " {\n \"uber\" : { \'version\' : \"1.0\", \"data\" : {}}}";
      var msg = message(xml);
      assert.equal(msg.rawFormat(), "json");
    });

    it('should be able properly reject unknwon message format', function() {
      var xml = " ljlkjljk";
      var msg = message(xml);
      assert.equal(msg.rawFormat(), "unknown");
    });
  });
});