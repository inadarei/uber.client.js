var u = require('./util');

/**
 * Class/constructor definition for a Data object.
 * @constructor
 *
 * @property msg
 *  JSON fragment to initialize the data element with
 */
function Data(msg) {
  if (!msg) { msg = {}; }

  if (typeof msg !== 'object') { // uh-oh, did they pass us just a JSON string?
    msg = JSON.parse(msg); // maybe we can fix it for them…
  }

  this.jsonMessage = msg;

  // Expose properties defined in UBER spec:
  var predefinedPropNames = ["id", "name", "rel", "url", "action", "transclude", "model", "sending", "accepting", "value"];
  var properties = {}, kkey;
  var self = this;

  for (var idx = 0; idx<predefinedPropNames.length; idx++) {
    kkey = predefinedPropNames[idx];
    if (typeof msg[kkey] !== 'undefined') {
      properties[kkey] = msg[kkey];
    } else {
      properties[kkey] = "";
    }
  }

  /*jshint -W083 */
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
  // Handle data property separately
  if (msg.data && typeof msg.data === 'object') {
    msg.data = new Data(msg.data);
  }
}

exports.Data = Data;

/**
 * Return JSON object representing the Data.
 *
 * @returns {*}
 */
Data.prototype.json = function() {
  return this.jsonMessage;
};

/**
 * Centrally implemented querying of UBER JSON so both Client and Data classes can use it.
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
  return u.query(this.json(), selector, context);
};
