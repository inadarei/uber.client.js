var exports = module.exports;
exports.Data = Data;

var u    = require('./util')  // Ours
  , DataArray = require('./dataArray').DataArray
  , util = require('util') // The Node.js one
  , _    = require('underscore');

/**
 * Class/constructor definition for a Data object.
 * @constructor
 *
 * @property msg
 *  JSON fragment to initialize the data element with. It is either an array of data elements or a JSON object
 */
function Data(msg) {
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

  if (Array.isArray(msg) || typeof msg !== 'object') {
    throw new Error("Data class may only be initialized with a non-array JSON object. Found: " + JSON.stringify(msg));
  }

  this.enableSetterGettersForPredefinedProperties(self);

  // data property needs special love of recursion
  if (msg.data) {
    if (Array.isArray(msg.data)) { // current element contains a data element in its array form
      this.data = new DataArray(msg.data);
    } else if (typeof msg.data.query === 'function') { // .data property is already a DataArray object
      this.data = msg.data;
    } else { // malformed UBER
      throw new Error("Malformed message: data element must be an array. Found: \n" + msg.data);
    }
  }
}

Data.prototype.enableSetterGettersForPredefinedProperties = function(self) {
  // Expose properties defined in UBER spec:
  var predefinedPropNames = ["id", "name", "rel", "url", "action", "transclude", "model", "sending", "accepting", "value"];
  var properties = {}, kkey;
  var msg = self.json;

  for (var idx = 0; idx<predefinedPropNames.length; idx++) {
    kkey = predefinedPropNames[idx];
    if (typeof msg[kkey] !== 'undefined') {
      properties[kkey] = msg[kkey];
      self[kkey] = msg[kkey];
    } else {
      properties[kkey] = "";
    }
  }

  /*jshint -W083 */
  /** If we need to run any restrictions on the properties:
  for (var i in properties) {
    if(properties.hasOwnProperty(i)) {
      (function (i) {
        Object.defineProperty(self, i, {
          // Create a new getter for the property
          get: function () {
            return properties[i];
          },
          // Create a new setter for the property
          set: function (val) {
            properties[i] = val;
          }
        });
      })(i);
    }
  }
  */
};

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
Data.prototype.query = function(selector, context) {
  return u.query(this.json, selector, context);
};
