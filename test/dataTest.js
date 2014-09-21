var chai = require('chai')
  , assert = chai.assert
  , expect = chai.expect
  , should = chai.should();

var Data = require('../lib/data').Data
  , tutil  = require('./support/fixture-helper');


describe('Uber Data class', function() {

  describe('Constructor function', function() {

    var sampleJson;

    beforeEach(function(done){
      tutil.loadFixture('uber-document.json', function(err, json) {
        if (err)  { assert.fail(err); }

        sampleJson = json;
        done();
      });
    });

    it('should not care if we pass a string json or an actual object', function(done) {
        var data  = new Data(JSON.parse(sampleJson))
          , data2 = new Data(sampleJson);

        data.should.deep.equal(data2);
        done();
    });

    it('should parse data structure recursively producing data objects, not: just JSON', function(done) {
        var data  = new Data(JSON.parse(sampleJson));
        //data.should.deep.equal(data2);

        done();
    });

  });
});
