var exports = module.exports = {};

var _    = require('underscore')
  , Data = require('./dataElement').Data;

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

  var pattern = selector[searchKey];
  var result = findQueryMatches(json, searchKey, pattern);

  return result;

};

/**
 *
 * @param json
 * @param key
 * @param pattern
 *  is a Javascript regex object or a literal string that 'key' should match
 *
 * @returns {Array} of results (Data objects).
 */
function findQueryMatches(json, key, pattern) {
  if (!(pattern instanceof RegExp)) {
    pattern = new RegExp(pattern, "i");
  }
  var unfilteredJsonObjects = findAllKeyDataEntities(json, key);
  var matchedJsonObjects = [];
  var element;

  matchedJsonObjects = _.filter(unfilteredJsonObjects, function(element) {
    var el = element[key];

    var matchFound = false;
    if (Array.isArray(el)) { //rels are arrays!
      for (var gg=0; gg<el.length; gg++) {
        if (el[gg].match(pattern)) {
          matchFound = true;
        }
      }
    } else {
      matchFound = el.match(pattern);
    }
    return matchFound;
  });

  var matchedDataObjects =  _.map(matchedJsonObjects, function(val, key) {
    return new Data(val);
  });

  return matchedDataObjects;

}

/**
 * Finds all Data elements that contain the @key key. This function call
 * can be memoized in the future to support caching.
 *
 * @param json
 * @param key
 *
 * @returns {Array} of results (json objects)
 */
function findAllKeyDataEntities(json, key, isChildStep) {
  var prop, subprop;
  var results = [];

  // The top-level element should be analyzed only at the top of the recursion, otherwise
  // we will have duplicates.
  if (!isChildStep) {
    if (json[key]) { results[results.length] = json; }
  }

  for (prop in json) {
    if (json.hasOwnProperty(prop) && typeof json[prop] === 'object') { // no need to analyze letters of a string property
      for (subprop in json[prop]) {
        if (json[prop].hasOwnProperty(subprop)) {
          if (subprop === key) {
            // We are interested in the json object surrounding the the key (e.g. "rel"),
            // not the one "rel" points to.
            results[results.length] = json[prop];
          }
        }
      }

      // Recursion
      if (typeof json[prop] === 'object') {
        var next = findAllKeyDataEntities(json[prop], key, true);
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
