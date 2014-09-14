var request = require('request');


// Exports

module.exports.authProvider = function(implFunction, options) {
  console.log('Auth Provider Called');
};

module.exports.request = function (url, callback) {
  console.log('UBER Request initiated');
}