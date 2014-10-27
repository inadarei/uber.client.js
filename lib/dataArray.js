var exports = module.exports;
exports.DataArray = DataArray;

var u    = require('./util')  // Ours
  , Data = require('./dataElement').Data
  , util = require('util') // The Node.js one
  , _    = require('underscore');

util.inherits(DataArray, Array);

/**
 * Class/constructor definition for a DataArray object.
 * @constructor
 *
 * @property msg
 *  JSON fragment to initialize the data element with. It is either an array of data elements or a JSON object
 */
function DataArray(msg) {
  var initJSONData;
  // Preventing closure-related hell with "this"
  var self = this;

  if (!msg) { msg = []; }
  if (typeof msg !== 'object') { // uh-oh, did they pass us just a JSON string?
    try {
      msg = JSON.parse(msg); // maybe we can fix it for them…
    } catch (e) {
      throw new Error("Couldn't parse JSON string provided. Please pass a proper JSON object instead. \n\t" + e);
    }
  }

  // Creating a hidden property for internal use only.
  initJSONData = msg;

  Object.defineProperty(this, 'json', {
    get: function() { return initJSONData; }
  });

  if (!Array.isArray(msg)) {
    throw new Error("DataArray class may only be initialized with an JSON array. Found: " + JSON.stringify(msg));
  }

  for (var j=0; j<msg.length; j++) {
    this.push(new Data(msg[j]));
  }

}

// Prettiness matters. Let's get ourselves pretty console.out's
/* DataArray.prototype.prettyToString = function(){
  var out = "[";
  for (var i=0; i < this.length; i++) {
    if (i !== 0) { out = out + ", "; }
    out = out + this[i];
  }
  out = out + "]";
  return out;
}; */

// Prettiness matters. Let's get ourselves pretty console.out's
//Data.prototype.inspect = function() {
//if (this.length && this.length > 1) {
//  return this.prettyToString();
//} else {
//    return this.toString();
//}
//};



/**
 * Delegate for the centrally implemented querying of UBER JSON so both Client and Data classes can use it.
 *
 * @param json
 * @param selector
 *  a JSON object, where value is a regular expression and the key is one of:
 *    - id
 *    - name
 *    - rel
 *
 * @param json
 *
 * @returns {string|*}
 */
DataArray.prototype.query = function(selector, context) {
  return u.query(this.json, selector, context);
};

