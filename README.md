uber.client.js
==============

Javascript/Node.js Client for UBER Hypermedia 

## API Doc

### Class: Message

#### Properties

1. version

#### Methods

1. data() - returns an array of `Data` elements
2. error() - returns an array of `Data` elements
3. raw() - returns the raw original text of the message (XML or JSON). Response object is of the form: `{"format" : "json", "message" : "..." }`
4. rawJSON() - returns the JSON serialization of the original message. This is late binding (does parsing at every call) to optimize memory by compromising processing speed.


### Class: Data

#### Properties

#### Methods

1. rel() - returns an array of LinkRelation objects
2. follow() - follows the `url` property, if present and if a resolvable URL, and retrieves an UBER document on the other end. Returns an Uber object.

### Class: LinkRelation

#### Properties

1. name

#### Methods

1. isURL() - is link relation name a proper URL?
2. resolve() - resolve the link relation, if it is a proper URL

### Class: Parser

#### Methods

1. Constructors(message) 
2. detect() - detects the source serialization format of a message: JSON, XML or invalid (for now)
2. transcode(message, inputFormat = null) - transcodes any supported input format (for now: XML) to UBER/JSON
3. parse(message, inputFormat = null) - parses any supported input format (XML or JSON, for now) into UBER Message object graph
