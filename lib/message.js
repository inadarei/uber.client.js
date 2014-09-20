var parseString = require('xml2js').parseString
  , u = require('./util');

/**
 * Class/constructor definition for a Message object.
 * @constructor
 */
function Message(msg) {
  if (!msg) { msg = ""; }

  this.rawMessage = msg;
  this.jsonMessage = "";
}

exports.Message = Message;

var exports = module.exports = function(message) {
  return new Message(message);
};

/**
 * Return JSON object representing the message.
 *
 * @returns {*}
 */
Message.prototype.json = function() {
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
Message.prototype.query = function(selector, context) {
  return u.query(this.json(), selector, context);
};

/*
 * Returns the raw original text of the message (XML or JSON)
 */
Message.prototype.raw = function() {
  return this.rawMessage;
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
  if (this.jsonMessage) { callback(null, this.jsonMessage); return; }

  var self = this;

  if (this.rawFormat === "json") { callback(null, this.rawMessage); return; }
  if (this.rawFormat === "unknown") {
    callback(new Error('Uknown message format'));
  }
  // Ok. message was in XML. Let's try translate it
  parseString(this.rawMessage, function (err, result) {
    result = uberizeJSON(result);
    if (err) { callback(err, result); return; }
    self.jsonMessage = result;
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
