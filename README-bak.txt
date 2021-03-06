= Node.js Client for UBER Hypermedia Type

link:https://travis-ci.org/inadarei/uber.client.js[image:https://travis-ci.org/inadarei/uber.client.js.svg?branch=master[alt="build status]] &nbsp;
link:https://coveralls.io/r/inadarei/uber.client.js[image:https://coveralls.io/repos/inadarei/uber.client.js/badge.png[alt="test coverage"]] &nbsp;
link:https://codeclimate.com/github/inadarei/uber.client.js[image:https://codeclimate.com/github/inadarei/uber.client.js/badges/gpa.svg[alt="CodeClimate GPA score"]] &nbsp;
link:https://www.npmjs.org/package/uberclient[image:https://img.shields.io/npm/v/uberclient.svg[alt="npm version"]]

:toc:
:numbered:

== Document Status
Author::
  Irakli Nadareishvili
Status::
  *[white red-background]#Early, incomplete alpha#*
Limitations::
  Doesn't handle documents with circular references.

////
  *[white blue-background]#Release Candidate#*
  *[white green-background]#Released#*
////

////
Last Updated::
  {docdate}
////

== General
Node.js client is an implementation of an SDK-level client for the http://uberhypermedia.org[UBER hypermedia message format]

== Design Goals
Minimal, robust, extensible

.Example1:
[source,javascript]
----
var client = require('uberclient')
  , token  = '1234567890'; // You'd normally get this from a separate OAuth2 workflow

client.authProvider(client.authProviderTokenBased({'token' : token}));

client.request('http://api.froyo.io', function (error, msg) {
  if (!error) {
    var names = msg.query({"rel" : "urn:froyo_io:query:names"}).submit({"m" : "male"});
  }
}, "read", "xml");
----

.Example2:
[source,javascript]
----
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
----

== API Documentation

=== Module: uberclient

==== Methods

request(url, callback [,action])::
  make a request
  
  +url+;;
    a properly-formatted URL string
    
  +callback(error, message)+;;
    callback function which accepts error and message parameters
  
  +action+;; 
    Is one of the actions defined by http://uberhypermedia[UBER spec]. Defaults to 'read' which would correspond to GET for HTTP.
  
authProvider(providerFunction)::
  sets the authorization provider that will be used henceforth. Provider function accepts +options+ javascript object used 
  for configuring specific type of a provider. UberClient pre-defines two types of providers (HTTP OAuth2-compatible, 
  bearer token-based and HTTP URL query-param based). Any provider function can be passed to extend this functionality. THe 
  implementing function must expose preprocessRequest(request) function that will be called before a request is fired.
  
authProviderTokenBased({"token" : "...", "header-field" : "..."})::
   OAuth-2 compatible. `header-field` defaults to `Bearer` resulting in an HTTP request header field of the form: `Authorization: Bearer xxxxxxxxxxxxxx`
  

authProviderApikeyBased({"apikey" : "...", "query-field" : "..."})::
   API Key compatible. `query-field` defaults to `key` resulting in an HTTP request query field of the form: `?key=xxxx` or `&key=xxxx`
  
=== Module: message
==== Methods

new(message, callback)::
  Mints a new message using a properly-formatted UBER message serialized in XML or JSON.
  Callback accepts:
  - +err+ to indicate cases when aan error may occur
  - +uberMessage+ the fully-minted <<anchorMessage,Message>> object

=== [[anchorMessage]]Class: Message

==== Properties

+version+::
  returns the version of the UBER format used in this message. Read-only.
+rawMessage::
  returns the raw representation of the message the object was initialized with. Read-only.

query(selector [, context])::
  @See: the identical method for the Data class.

data()::
  returns an array of `Data` elements
  
error()::
  returns an array of `Data` elements

=== Class: DataArray

==== Methods

query(selector [, context])::
  @See: the identical method for the Data class.

=== Class: Data

==== Properties

==== Methods

query(selector [, context])::
returns a new Data element containing child Data elements found in the context Data object, filtered based on passed argument(s).
Inpsired by http://api.jquery.com/jQuery/[jQuery()]

    +selector+;;
      is a JSON object, value of which is a string or a regular expression. Please note: numbers are compared as strings
      and variable type is ignored.
      The key is one of the following options:
      +
      - +id+ matches by ID
      - +name+ matches by name
      - +rel+ matches by any of the rels.
      - +value+ matches by value property
+     
[NOTE]
A special case of `{"*" : "*"}` stands for: "match any elements" (Not yet implemented)
+
.Example
[source,javascript]
----
var locationdata = data.query({"rel" : "loc+*"}).query({"name" : "eiffel"});
----
    +context+;;
      can have one of two values:
      - 'children' (default)
      - 'first-child'
      - 'last-child'
      - 'depth-n' where n is a number 1-10 (infinite depth is prohibited)

follow(callback)::
follow a URL in the data element if the field is defined. Callback accepts `error` and `message` params.

submit(callback)::
construct a templated request if URL and Model are defined and submit data. Callback accepts `error` and `message` params.

=== Class: LinkRelation [TBD]

==== Properties

1. name

==== Methods

1. isURL() - is link relation name a proper URL?
2. resolve() - resolve the link relation, if it is a proper URL
