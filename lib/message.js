var xml2js = require('xml2js')
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
 * Returns the format of the original text of the message (xml or json or "unknwon"). Lazy parsing.
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
 * @TODO implement
 */
Message.prototype.toString = function() {
  return this.rawMessage;
};