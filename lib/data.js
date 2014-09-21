var u = require('./util')
  , _ = require('underscore');

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
    msg = JSON.parse(msg); // maybe we can fix it for them…
  }

  // Creating a hidden property for internal use only.
  initJSONData = _.clone(msg);
  Object.defineProperty(this, 'json', {
    get: function() { return initJSONData; }
  });

  if (Array.isArray(msg)) {
    self.data = [];
    for (var j=0; j<msg.length; j++) {
      self.data[j] = new Data(msg[j]);
    }
  } else if (msg.data && Array.isArray(msg.data)) { // Note: a JSON object can't be an array AND have a property
    self.data = [];
    for (var k=0; k<msg.data.length; k++) {
      self.data[k] = new Data(msg[k]);
    }
  }

  self.enableSetterGettersForPredefinedProperties(self);
}

Data.prototype.enableSetterGettersForPredefinedProperties = function(self) {
  // Expose properties defined in UBER spec:
  var predefinedPropNames = ["id", "name", "rel", "url", "action", "transclude", "model", "sending", "accepting", "value"];
  var properties = {}, kkey;
  var msg = self.json;

  //console.log(self.json);

  for (var idx = 0; idx<predefinedPropNames.length; idx++) {
    kkey = predefinedPropNames[idx];
    if (typeof msg[kkey] !== 'undefined') {
      properties[kkey] = msg[kkey];
    } else {
      properties[kkey] = "";
    }
  }

  // console.dir(properties);

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
};

exports.Data = Data;

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
