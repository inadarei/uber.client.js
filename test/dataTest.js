var chai = require('chai')
  , assert = chai.assert
  , expect = chai.expect
  , should = chai.should();

var Data = require('../lib/dataElement').Data
  , tutil  = require('./support/fixture-helper');


describe('Uber Data class', function() {
  var sampleNestedJson;

  beforeEach(function(done){
    tutil.loadFixture('uber-data-nested.json', function(err, json) {
      should.not.exist(err);
      should.exist(json);

      sampleNestedJson = json;
      done();
    });
  });

  describe('Constructor function', function() {
    it('should be able to parse simple, flat JSON without any dependencies', function(done) {
      tutil.loadFixture('uber-data-flat.json', function(err, json) {
        should.not.exist(err);
        should.exist(json);

        var somedata = new Data(json);
        done();
      });
    });

    it('should not care if we pass a string json or an actual object', function (done) {
      var data = new Data(JSON.parse(sampleNestedJson))
        , data2 = new Data(sampleNestedJson);

      data.should.deep.equal(data2);
      done();
    });

    it('should parse deep data structure recursively producing data objects, not: just JSON', function (done) {
      var data = new Data(sampleNestedJson);

      data.url.should.equal('http://example.org/list/1');
      data.rel[1].should.equal('http://example.org/rels/todo');
      data.data[1].name.should.equal('dueDate');
      data.data[1].value.should.equal('2014-05-01');
      data.data[0].data[0].value.should.equal('Some Label');
      done();
    });
  });

  describe('query function', function() {
    it('should be able to query through Data objects', function(done) {
      var data  = new Data(sampleNestedJson);
      var result;

      result = data.query({"name" : "dueDate"});
      result[0].value.should.equal('2014-05-01');

      result = data.query({"id" : "someID"});
      result[0].value.should.equal('Some Label');

      result = data.query({"rel" : "item"});
      result[1].id.should.equal('someID');

      done();
    });

  });
});
