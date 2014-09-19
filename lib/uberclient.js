var request = require('request')
    u       = require('./util')
    message     = require('./message');

var exports = module.exports = {};


// Exports

exports.authProviderTokenBased = require('./auth_token_provider');

exports.authProvider = function(implFunction, options) {
  console.log('Auth Provider Called');
};

/**
 *
 * Make a request (only HTTP supported at this point).
 *
 * @param url
 *  a properly-formatted URL string
 * @param callback
 *  callback function which accepts error and message parameters
 * @param action
 *  is one of the actions defined by UBER spec. Defaults to read which would correspond to GET for HTTP.
 * @param format
 *  is "xml" or "json"
 */
exports.request = function (url, callback, action, format) {
  var acceptFormat;

  if (!action) { action = 'read'; }
  if (!format) { format = 'json'; } //defaults to JSON;

  switch (format) {
    case 'xml' :
      acceptFormat = u.uberMediaTypeXML;
    case 'json' :
      acceptFormat = u.uberMediaTypeJSON;
    default :
      acceptFormat = u.uberMediaTypeJSON;
  }

  var options = {
    url: url,
    headers: { 'Accept': acceptFormat },
    method: u.action2HttpMethod(action)
  };

  request(options, function (error, response, body) {
    if (!error && u.isHttpSuccess(response.statusCode)) {
      var msg = message(body);
      callback(null, msg);
    } else {
      callback(error, body);
    }
  });
}
