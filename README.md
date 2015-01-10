uber.client.js
==============

![MIT License](https://img.shields.io/npm/l/uberclient.svg?style=flat)
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

You can see full documentation of the client at: http://jsclient.uberhypermedia.org

## License

The MIT License (MIT)

Copyright (c) 2014-2015 Irakli Nadareishvili

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

