var exports = module.exports = {};

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
exports.query = function(json, selector, context) {
  var searchKey = null;

  if (selector.id) {
    searchKey = 'id';
  } else if (selector.name) {
    searchKey = 'name';
  } else if (selector.rel) {
    searchKey = 'rel';
  } else {
    throw new Error("Unsupported key provided in UBER query selector");
  }

  var regex = selector.searchKey;

  var result = findQueryMatches(json, searchKey, regex);
  console.log("=========================");
  console.dir(JSON.stringify(result));
  // console.dir(result);

};

function findQueryMatches(json, key, regex) {
  var prop, subprop;

  var results = [];

  for (prop in json) {
    if (json.hasOwnProperty(prop)) {
      for (subprop in json[prop]) {
        if (json[prop].hasOwnProperty(subprop)) {
          if (subprop === key) {
            // We are interested in the json object surrounding the "rel", not the one "rel" points to.
            results[results.length] = json[prop];
          }
        }
      }

      // Recursion
      if (typeof json[prop] === 'object') {
        var next = findQueryMatches(json[prop], key, regex, results);
        // concatenate
        if (next instanceof Array) {
          for (var i =0; i<next.length; i++) {
            results[results.length] = next[i];
          }
        }
      }
    }
  }
  return results;
}

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
