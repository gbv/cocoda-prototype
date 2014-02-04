# Introduction

Cocoda is designed as hypermedia application. That means a client follows URLs
returned by a Cocoda server instead of assuming some URL structure.

# Cocoda Resources

## Cocoda Resource Media Type

Cocoda defines the media type `application/vnd.cocoda+json` for use with Cocoda
applications. The media type is prepared for registration at IANA as specified
by [RFC 6838].

Type name
  : application

Subtype name
  : vnd.cocoda+json

Required parameters
  : N/A

Optional parameters
  : N/A

    In particular, because [RFC 4627] already defines the character
    encoding for JSON, no "charset" parameter is used.

Encoding considerations
  : See [RFC 6839, Section 3.1](http://tools.ietf.org/html/rfc6839#section-3.1).

Security considerations
  : A Cocoda Resource is a JavaScript Object Notation (JSON) object, so it 
    shares security issues common to all JSON content types. See 
    [RFC 4627, Section 6](http://tools.ietf.org/html/rfc4627#section-6) 
    for additional information.

It is a
    text format that must be parsed by entities that wish to utilize the format.
    Depending on the language and mechanism used to parse a JSON object, it is
    possible for an attacker to inject behavior into a running program. 
    Therefore, care must be taken to properly parse a received JRD to ensure
    that only a valid JSON object is present and that no JavaScript or other 
    code is injected or executed unexpectedly.

Interoperability considerations
  : This media type is a JavaScript Object Notation (JSON) object and can be
    consumed by any software application that can consume JSON objects.

Published specification
  : ...

Applications that use this media type
  : ...

Fragment identifier considerations
  : ...

Additional information
  : ...

Person & email address to contact for further information
  : Jakob Voß <voss@gbv.de>

Intended usage
  : COMMON

Restrictions on usage
  : N/A

Author
  : Jakob Voß <voss@gbv.de>

[RFC 6838]: http://tools.ietf.org/html/rfc6838

## TODO

Support paging (RFC 5005) for large result sets.

