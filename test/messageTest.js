var chai = require('chai')
  , assert = chai.assert
  , expect = chai.expect
  , should = chai.should();

var message = require('../lib/message')
  , tutil  = require('./support/fixture-helper');


describe('Uber Message class', function() {
  describe('rawFormat() function', function() {
    it('should be able to properly detect XML message format', function() {
      var xml = " <uber version=\"1.0\">\n<data>blah</data>\n</uber>";
      var msg = message(xml);
      msg.rawFormat().should.equal("xml");
    });

    it('should be able to properly detect JSON message format', function() {
      var xml = " {\n \"uber\" : { \'version\' : \"1.0\", \"data\" : {}}}";
      var msg = message(xml);
      msg.rawFormat().should.equal("json");
    });

    it('should be able to properly reject unknwon message format', function() {
      var xml = " ljlkjljk";
      var msg = message(xml);
      msg.rawFormat().should.equal("unknown");
    });
  });

  describe('toJSON function', function() {
    it('should be able to translate XML UBER to JSON UBER', function(done) {
      tutil.loadFixture('uber-document.xml', function(err, data) {
        if (err)  { assert.fail(err); }
        var xml = data;
        var msg = message(xml);
        msg.toJSON(function(err, jsonmsg) {
          //Cleaning parser putting attribs as $'s
          jsonmsg.uber.version.should.equal("1.0");
          jsonmsg.uber.data.should.have.length(5);
          // Turning rels into arrays:
          jsonmsg.uber.data[2].rel.should.have.length(2);
          jsonmsg.uber.data[2].rel[0].should.equal("search");
          // "Cleaning parser putting vals as '_'
          jsonmsg.uber.data[3].data[1].value.should.equal("2014-05-01");
          done();
        });

      });
    });
  });
});
