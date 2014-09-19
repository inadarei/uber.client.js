var after  = require('after')
  , should = require('should')
  , assert = require('assert');

var message = require('../lib/message')
    tutil  = require('./testUtil');


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

  describe('toJSON function', function() {
    it('should be able to translate XML UBER to JSON UBER', function(done) {
      tutil.loadFixture('uber-document.xml', function(err, data) {
        if (err) assert.fail(err);
        var xml = data;
        var msg = message(xml);
        msg.toJSON(function(err, jsonmsg) {
          assert.equal(jsonmsg.uber.version, "1.0", "Cleaning parser putting attribs as $'s");
          assert.equal(jsonmsg.uber.data[2]['rel'][0], "search", "Turning rels into arrays");
          assert.equal(jsonmsg.uber.data[3]['data'][1]['value'], "2014-05-01", "Cleaning parser putting vals as '_'");

          done();
        });

      });
    });
  });
});