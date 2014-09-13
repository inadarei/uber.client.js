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


### Class: Data

#### Properties

#### Methods

### Class: Parser

#### Methods

1. Constructors(message) 
2. detect() - detects the source serialization format of a message: JSON, XML or invalid (for now)
2. transcode(message, inputFormat = null) - transcodes any supported input format (for now: XML) to UBER/JSON
3. parse(message, inputFormat = null) - parses any supported input format (XML or JSON, for now) into UBER Message object graph
