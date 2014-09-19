var parseString = require('xml2js').parseString;

var exports = module.exports = function(message) {
  return new Message(message);
};

/**
 * Class/constructor definition for a Message object.
 * @constructor
 */
function Message(msg) {
  if (!msg) msg = "";
  this.rawMessage = msg;
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
  if (this.format) return this.format;

  if (this.rawMessage.match(/^\s*?<uber\s*?version(.|\n)*?>(.|\n)*<\/uber>/im)) {
    this.format = "xml";
  }

  if (this.rawMessage.match(/^\s*?{\s*("|')uber("|')\s*:\s*{\s*("|')version("|')(.|\n)*}/im)) {
    this.format =  "json";
  }

  if (!this.format) this.format = "unknown";

  return this.format;
};

/*
 * Serializes the current message object into UBER JSON representation (actual JS obj, not a: text literal).
 */
Message.prototype.toJSON = function(callback) {
  if (this.json) return this.json;

  if (this.rawFormat == "json") { callback(null, this.rawMessage); return; }
  if (this.rawFormat == "unknown") {
    callback(new Error('Uknown message format'))
  }
  // Ok. message was in XML. Let's try translate it
  parseString(this.rawMessage, function (err, result) {
    result = uberizeJSON(result);
    if (err) { callback(err, result); return; }
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
    if (prop == 'rel') {
      json[prop] = json[prop].split(' ');
    }
    if (prop == '_') {
      json['value'] = json[prop]; delete json[prop];
    }
    if (prop == '$') {
      for (el in json[prop]) {
        if (el == 'rel') {
          json[prop][el] = json[prop][el].split(/\s+?/im);
        }
        if (el == '_') {
          json[prop]['val'] = json[prop][el]; delete json[prop][el];
        }
        json[el] = json[prop][el];
      }
      delete json[prop];
    }
    if (typeof json[prop] === 'object') {
      json[prop] = uberizeJSON(json[prop]);
    }
  }

  return json;
}

/*
 * @TODO implement
 */
Message.prototype.toString = function() {
  return this.rawMessage;
};
