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

1. children() - returns an array of first-level decendants of the Data object in question.
1. filter(options) - return a virtual (created) Data object enclosed over a sub-set of 1st decendants of the original Data object, filtered by `options`:
    1. `options` - a configuration parameter that can filter by `rels`, `name` or `id`. 
        
        If you indicate multiple options, they are joined with an `OR` relationship: e.g. you will gave all elements that have certain name but also all elements that have certain id. If you need an `AND` relationship, you should join filter() calls.
        
        The `rels` option is an array and a match happens if any of the indicated values are present (`OR` relationship). If `AND` relationship-filtering is required, filter() calls must be chained. For example:
        
        ```javascript
        var fooOrbarData  = data.children({"rels" : ["foo", "bar"]});
        var foobarData    = data.children({"rels" : ["foo"]}).filter({"rels" : ["bar"]});
        var calledFooOrHavingIdBar = data.children({"name" : "foo", "id" : "bar"}); // This is a 'union'
        ```
1. rels() - returns an array of LinkRelation objects
2. relName - returns 
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
3. parse(message, inputFormat = null) - parses any supported input format (XML or JSON, for now) into UBER Message object graph. Parsing is always lazy: only first level of the hierarchy is parsed.
