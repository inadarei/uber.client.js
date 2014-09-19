var request = require('request')
    u       = require('./util')
    message     = require('./message');

var exports = module.exports = {};


// Exports

exports.authProviderTokenBased = require('./auth_token_provider');

exports.authProvider = function(implFunction, options) {
  console.log('Auth Provider Called');
};

exports.request = function (url, callback) {
  request(url, function (error, response, body) {
    if (!error && u.isHttpSuccess(response.statusCode)) {
      var msg = message(body);
      callback(null, msg);
    } else {
      callback(error, body);
    }
  });
}
