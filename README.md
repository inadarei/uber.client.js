uber.client.js
==============

[![Build Status](https://travis-ci.org/inadarei/uber.client.js.svg?branch=master)](https://travis-ci.org/inadarei/uber.client.js) &nbsp;
[![Coverage Status](https://coveralls.io/repos/inadarei/uber.client.js/badge.png?branch=master)](https://coveralls.io/r/inadarei/uber.client.js?branch=master) &nbsp;
[![Code Climate](https://codeclimate.com/github/inadarei/uber.client.js/badges/gpa.svg)](https://codeclimate.com/github/inadarei/uber.client.js) &nbsp;
[![NPM Version](https://img.shields.io/npm/v/uberclient.svg)](https://www.npmjs.org/package/uberclient) &nbsp;


Javascript/Node.js Client for [UBER hypermedia format](http://uberhypermedia.org).

### Design Goals
Minimal, robust, extensible

#### Example 1:

```javascript
var client = require('uberclient')
  , token  = '1234567890'; // You'd normally get this from a separate OAuth2 workflow

client.authProvider(client.authProviderTokenBased({'token' : token}));

client.request('http://api.froyo.io', function (error, msg) {
  if (!error) {
    var names = msg.query({"rel" : "urn:froyo_io:query:names"}).submit({"m" : "male"});
  }
}, "read", "xml");
```

#### Example 2:

```javascript
 var url = 'https://raw.githubusercontent.com/inadarei/uber.client.js/master/test/fixtures/uber-sample.json';
    client.request(url, function(error, uberMsg) {
      if (!err) {
        var appendPerson = uberMsg.query({"id" : "people"})
                          .query({"rel" : "http://example.org/rels/create"})
                          .submit({"g" : "irakli",
                                   "f" : "nadareishvili",
                                   "e" : "irakli@example.com"});
                                   // Warning: .submit() implementation is in progress.
      }
    });
```

### Full Documentation

You can see full documentation of the client at: [[http://jsclient.uberhypermedia.org]]