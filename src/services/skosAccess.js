'use strict';
/**
 * @ngdoc service
 * @name ng-skos.skosAccess
 * @description
 * Look up concepts and terminologies by URI. 
 *
 * An skosAccess service should be used as layer to access concepts and
 * terminologies. The service adds caching and additional methods to expand
 * a list of URIs to a list of concept or terminology objects. 
 *
 * See CocodaClient for a sample source.
 *
 * <pre>
 * var ddc = CocodaTerminology("http://example.org/ddc/");
 * var ddcAccess = new skosAccess(ddc);
 * </pre>
 *
 * @example
 <example>
  <file name="index.html">
    ...
  </file>
  <file name="script.js">
    var provider = new skosAccess({
        concept: function(uri, cb) { ... };
    });
    var concepts = ["http://example.org/term1", "http://example.org/term2"];
    provider.getConcepts(concepts);
  </file>
</example>
 */
ngSKOS.factory('skosAccess',function() {
    // TODO: use $angularCacheFactory for caching
    return function(source) {
        var provider = this;

        if (!source) {
            source = {
                concept: function(uri, callback) {
                    callback( { uri: uri } );
                },
                terminology: function(uri, callback) {
                    callback( { uri: uri } );
                },
            };
        };
        this.source = source;
        
        this.getConcept = function(uri,callback) {
            // TODO: caching, use this
            provider.source.concept(uri, callback);
        }

        this.getTerminology = function(uri) {
            // TODO: caching, use this.
            provider.source.terminology(uri, callback);
        }

        this.getConcepts = function(concepts) {
            angular.forEach(concepts, function(key, value) {
                if (typeof value !== 'object') { // excludes null 
                    provider.getConcept( value, function(concept) {
                        concepts[key] = concept;
                    });
                }
            });
        };

        return provider;
    };
});
