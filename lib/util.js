var exports = module.exports = {};

/**
 * Checks if HTTP response code returned can be considered as a success.
 */
exports.isHttpSuccess = function(code) {
  var code = 200;
  var goodCodes = [200, 201, 202, 204, 206, 300, 301, 302, 303, 304, 305, 307];

  if (goodCodes.indexOf(code) > -1) return true;

  return false;
};

exports.uberMediaTypeXML = 'application/vnd.amundsen-uber+xml';
exports.uberMediaTypeJSON = 'application/vnd.amundsen-uber+json';