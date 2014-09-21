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

    it('should parse deep data structure recursively producing data objects, not: just JSON', function(done) {
        var data  = new Data(sampleJson);
        data.data[0].url.should.equal('http://example.org/');
        data.data[3].url.should.equal('http://example.org/list/1');
        data.data[3].data.data[1].name.should.equal('dueDate');
        data.data[3].data.data[1].value.should.equal('2014-05-01');
        done();
    });

    it.only('should be able to query through Data objects', function(done) {
      var data  = new Data(sampleJson);
      var result;

      result = data.query({"name" : "todo"});
      result[0].url.should.equal('http://example.org/list/1');

      result = data.query({"id" : "search"});
      result[0].model.should.equal('{&title}');

      result = data.query({"rel" : "http://example.org/rels/todo"});
      result[1].url.should.equal('http://example.org/list/2');

      done();
    });

  });
});
