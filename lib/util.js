var exports = module.exports = {};

/**
 * Checks if HTTP response code returned can be considered as a success.
 */
exports.isHttpSuccess = function(code) {
  var goodCodes = [200, 201, 202, 204, 206, 300, 301, 302, 303, 304, 305, 307];

  if (goodCodes.indexOf(code) > -1) { return true; }

  return false;
};

/*
 * UBER's "actiom" mapped to HTTP Methods. Defaults to "GET", don't cry about it
 */
exports.action2HttpMethod = function(action) {
  var mapping =  {"read"    : "GET",
                  "remove"  : "DELETE",
                  "replace" : "PUT",
                  "partial" : "PATCH",
                  "append"  : "POST"};

  if (typeof mapping[action] !== 'undefined') {
    return mapping[action];
  } else {
    return "GET";
  }
};

/**
 * Return appropriate UBER mime type string for a serialization format (xml or json). Defaults to json.
 * @param format
 * @returns {string|*}
 */
exports.selectMimeType = function(format) {
  var acceptFormat;

  switch (format) {
    case 'xml' :
      acceptFormat = this.uberMediaTypeXML;
      break;
    case 'json' :
      acceptFormat = this.uberMediaTypeJSON;
      break;
    default :
      acceptFormat = this.uberMediaTypeJSON;
  }

  return acceptFormat;
};

exports.uberMediaTypeXML = 'application/vnd.amundsen-uber+xml';
exports.uberMediaTypeJSON = 'application/vnd.amundsen-uber+json';
