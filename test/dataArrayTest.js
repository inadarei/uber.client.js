var chai = require('chai')
  , assert = chai.assert
  , expect = chai.expect
  , should = chai.should();

var Data = require('../lib/dataElement').Data
  , DataArray = require('../lib/dataArray').DataArray
  , tutil  = require('./support/fixture-helper');


describe('Uber DataArray class', function() {
  var sampleArrayJson;

  beforeEach(function(done){
    tutil.loadFixture('uber-data-array.json', function(err, json) {
      should.not.exist(err);
      should.exist(json);

      sampleArrayJson = json;
      done();
    });
  });

  describe('Constructor function', function() {
    it('should not care if we pass a string json or an actual object', function (done) {
      var data = new DataArray(JSON.parse(sampleArrayJson))
        , data2 = new DataArray(sampleArrayJson);

      data.should.deep.equal(data2);
      done();
    });

    it('should parse deep data structure recursively producing data objects, not: just JSON', function (done) {
      var data = new DataArray(sampleArrayJson);
      data[0].rel[0].should.equal('self');
      data[0].url.should.equal('http://example.org/');
      data[3].url.should.equal('http://example.org/list/1');
      data[3].data[0].value.should.equal('Clean house');

      done();
    });

    // This is a sample use-case that came up as possibly problematic in a larger test
    // so it qualified for having its own test, because why not.
    it('should properly parse data structure that contains nested data objects', function(done) {
      tutil.loadFixture('uber-data-array-nested.json', function(err, json) {
        should.not.exist(err);
        should.exist(json);

        var da = new DataArray(JSON.parse(json));
        da[1].data[0].data[0].value.should.equal(20);

        done();
      });
    });

    it('should throw an exception when malformed data is passed in', function(done) {
      tutil.loadFixture('uber-data-array-malformed.json', function(err, json) {
        should.not.exist(err);
        should.exist(json);

        var dataErr;

        try {
          var da = new DataArray(json);
        } catch(e) {
          dataErr = e;
        }

        dataErr.should.be.an.instanceOf(Error);
        done();
      });
    });

    it('should accept an empty message and default to an array when not provided', function(done) {
      var da = new DataArray();

      da.json.should.be.an.instanceOf(Array);
      done();
    });

    it('should throw an exception when a non-array json object is passed in as message', function(done) {
      var err;

      try {
        var da = new DataArray({ 'error' : 'someone set us up the bomb'});
      } catch (e) {
        err = e;
      }

      err.should.be.an.instanceOf(Error);
      done();
    });
  });

  describe('query function', function() {
    it('should be able to query through DataArray objects', function(done) {
      var data  = new DataArray(sampleArrayJson);
      var result;

      result = data.query({"name" : "dueDate"});
      result[1].value.should.equal('2014-06-01');

      result = data.query({"id" : "search"});
      result[0].model.should.equal('{&title}');

      done();
    });

    it('should be able to chain multiple queries', function(done) {
      var data  = new DataArray(sampleArrayJson);
      var result;
      result = data.query({"name" : "todo"}).query({"name": "title"}).query({"value" : "Paint the fence"});
      result[0].data[0].value.should.equal(20);

      done();
    });
  });
});
