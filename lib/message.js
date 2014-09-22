var parseString = require('xml2js').parseString
  , Data = require('./dataElement').Data
  , DataArray = require('./dataArray').DataArray
  , u = require('./util');

/**
 * Class/constructor definition for a Message object.
 * @constructor
 */
function Message(msg) {
  var jsonMessage   = "";

  if (!msg) { msg = ""; }
  var rawMessageHidden = msg;

  // Creating a hidden, read-only property containing raw initial message for internal use only.
  Object.defineProperty(this, 'rawMessage', {
    get: function() { return rawMessageHidden; }
  });

  // Creating a hidden property containing json for internal use only.
  Object.defineProperty(this, 'json', {
    get: function() { return jsonMessage; },
    set: function(value) {
      jsonMessage = value;
    }
  });
}

var exports = module.exports;

exports.new = function(message, callback) {
  var uberMsg = new Message(message);
  uberMsg.toJSON(function(err, jsonMessage) {
    if (!err) { // expand
        var dataEl, errorEl;
        if (typeof jsonMessage.uber.data === 'undefined' ) {
          dataEl = [];
        } else { dataEl = jsonMessage.uber.data; }
        if (typeof jsonMessage.uber.error === 'undefined' ) {
          errorEl = [];
        } else { errorEl = jsonMessage.uber.error; }
      uberMsg.data = new DataArray(dataEl);
      uberMsg.error = new DataArray(errorEl);
      uberMsg.version = jsonMessage.uber.version;
    }
    callback(err, uberMsg);
  });
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
Message.prototype.query = function(selector, context) {
  return u.query(this.json, selector, context);
};

/**
 * Detects and returns the format of the original text of the message (xml or json or "unknwon"). Lazy parsing.
 */
Message.prototype.rawFormat = function() {
  if (this.format) { return this.format; }

  if (this.rawMessage.match(/^\s*?<uber\s*?version(.|\n)*?>(.|\n)*<\/uber>/im)) {
    this.format = "xml";
  }

  if (this.rawMessage.match(/^\s*?{\s*("|')uber("|')\s*:\s*{\s*("|')version("|')(.|\n)*}/im)) {
    this.format =  "json";
  }

  if (!this.format) { this.format = "unknown"; }

  return this.format;
};

/*
 * Serializes the current message object into UBER JSON representation (actual JS obj, not a: text literal).
 */
Message.prototype.toJSON = function(callback) {
  if (this.json) { callback(null, this.json); return; }

  var self = this;

  if (this.rawFormat === "json") {
    self.json = this.rawMessage;
    callback(null, this.rawMessage);
    return;
  }
  if (this.rawFormat === "unknown") {
    callback(new Error('Uknown message format'));
  }
  // Ok. message was in XML. Let's try translate it using xml2js and post-massaging
  parseString(this.rawMessage, function (err, result) {
    result = uberizeJSON(result);
    if (err) { callback(err, result); return; }
    self.json = result;
    callback(null, result);
  });
};

/**
 * The way xml2js translates XML to JSON is not exactly how UBER's JSON looks like. Needs massaging.
 *
 * Specifically: xml2js:
 * - puts attribs under extra '$' (UBER doesn't)
 * - puts values under '_' (UBER uses special field called 'value')
 * - UBER uses space-separated values for rels in XML, but translates it into an array in JSON
 *
 * @param json
 * @returns {*}
 */
function uberizeJSON(json) {
  var prop, el;

  for (prop in json) {
    if (json.hasOwnProperty(prop)) {
      // rels in UBER XML are space-sep, in JSON: comma-sep.
      if (prop === 'rel') {
        json[prop] = json[prop].split(/\s+?/im);
        continue;
      }
      // UBER JSON puts XML's values into a special property named 'value'
      if (prop === '_') {
        json.value = json[prop];
        delete json[prop];
        continue;
      }

      // UBER JSON directly translates what used to be a property in XML as property in JSON
      // whereas js2xml puts those one level down under '$' special property.
      // So we need to pull all properties under an '$' one level up and delete '$';
      if (prop === '$') {
        for (el in json[prop]) {
          if (json[prop].hasOwnProperty(el)) {
            // rels in UBER XML are space-sep, in JSON: comma-sep.
            if (el === 'rel') {
              json[prop][el] = json[prop][el].split(/\s+?/im);
            }
            // UBER JSON puts XML's values into a special property named 'value'
            if (el === '_') {
              json[prop].val = json[prop][el];
              delete json[prop][el];
              continue;
            }
            json[el] = json[prop][el];
          }
        }
        delete json[prop];
      }

      // Recursion
      if (typeof json[prop] === 'object') {
        json[prop] = uberizeJSON(json[prop]);
      }

    }
  }

  return json;
}
