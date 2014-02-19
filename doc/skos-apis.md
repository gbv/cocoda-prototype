% APIs for the

The Simple Knowledge Organization System (SKOS) is an RDF-based standard to
express and exchange terminologies, such as thesauri, classifications, and
controlled vocabularies. General methods of access to RDF data include exchange
of RDF files (data dumps), harvesting selected ressources as Linked Open Data,
and querying via SPARQL. These methods, however, are often not suitable or
available for applications only interested in SKOS data. For this reason more
specific APIs have been developed to access knowledge organization systems.

# Overview of existing APIs

* TWC SKOS API: <http://tw.rpi.edu/web/project/CMSPV/SKOS_Vocabulary_Service_API>

* <http://openskos.org/api>

* <http://askosi.org/>

* [PoolParty API](http://poolparty.biz/skos-without-sparql-poolparty-skos-api/)

* xTree API

* [SWAD-Europe Thesaurus SKOS API](http://www.w3.org/2001/sw/Europe/reports/thes/8.7/#sec-api)
  (e.g see <http://nbii-thesaurus.ornl.gov/ws/services/SKOSThesaurusService?wsdl>)

* [OCLC Terminology Services API](http://oclc.org/developer/services/terminology-services)
  (based on SRU)

* <http://skosapi.sourceforge.net/>

# Comparision

## Query capabilities

search for concepts, search/list terminologies, expand pathes/multiple
levels...

+-----------+--------+-------------+-----------+----------+---------------+
| API       | search | topConcepts | ancestors | mappings | terminologies |
+-----------+--------+-------------+-----------+----------+---------------+
| OCLC      |   x    |     ?       |  ?        | ?        | -             |
| TWC       |        |             |           |          |               |
| SWAT      |        |             |           |          |               |
| xTree     |        |             |           |          |               |
| PoolParty |        |             |           |          |               |
| OpenSKOS  |        |             |           |          |               |
+-----------+--------+-------------+-----------+----------+---------------+

## Data Model

...multilingual labels, n-to-n mappings etc.

# Yet another SKOS API (Cocoda)

...
