var chai = require('chai')
  , assert = chai.assert
  , expect = chai.expect
  , should = chai.should();

var message = require('../lib/message')
  , tutil  = require('./support/fixture-helper');


describe('Uber Message class', function() {
  describe('rawFormat() function', function() {
    it('should be able to properly detect XML message format', function(done) {
      var xml = " <uber version=\"1.0\">\n<data>blah</data>\n<data name=\"mildred\">foo</data></uber>";
      message.new(xml, function(err, uberMessage) {
        should.not.exist(err);
        should.exist(uberMessage);
        uberMessage.rawFormat().should.equal("xml");
        done();
      });

    });

    it('should be able to properly detect JSON message format when supplied a JSON string', function(done) {
      var json = " {\n \"uber\" : { \"version\" : \"1.0\", \"data\" : []}}";
      message.new(json, function(err, uberMessage) {
        should.not.exist(err);
        should.exist(uberMessage);
        uberMessage.rawFormat().should.equal("json");
        done();
      });
    });

    it('should be able to properly detect JSON message format when supplied a JSON object', function(done) {
      var json = " {\n \"uber\" : { \"version\" : \"1.0\", \"data\" : []}}";
      json = JSON.parse(json);
      message.new(json, function(err, uberMessage) {
        should.not.exist(err);
        should.exist(uberMessage);
        uberMessage.rawFormat().should.equal("json");
        done();
      });
    });

    it('should be able to properly reject an unknwon message format', function(done) {
      var garbage = " ljlkjljk";
      message.new(garbage, function(err, uberMessage) {
        should.exist(err);
        should.not.exist(uberMessage);
        done();
      });
    });
  });

  describe('toJSON function', function() {
    it('should be able to translate XML UBER to JSON UBER', function(done) {
      tutil.loadFixture('uber-document.xml', function(err, data) {
        if (err)  { assert.fail(err); }
        var xml = data;
        var msg = message.new(xml, function (err, uberMessage) {
          should.not.exist(err);
          should.exist(uberMessage);

          //Cleaning parser putting attribs as $'s
          uberMessage.version.should.equal("1.0");
          uberMessage.data.should.have.length(5);
          // Turning rels into arrays:
          uberMessage.data[2].rel.should.have.length(2);
          uberMessage.data[2].rel[0].should.equal("search");
          // "Cleaning parser putting vals as '_'
          uberMessage.data[3].data[1].value.should.equal("2014-05-01");
          done();
        });
      });
    });
  });
});
