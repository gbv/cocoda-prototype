/**
 * @ngdoc overview
 * @name json-text
 * @module json-text
 * @description
 *
 * This utility module provides directive {@link json-text.directive:jsonText 
 * jsonText} for directly displaying or editing JSON objects as text strings.
 */

angular.module('jsonText',[])
/**
 * @ngdoc directive
 * @name json-text.directive:jsonText
 * @restrict AE
 * @param {string} ngModel angular expression to bind to.
 * @description
 *
 * This directive can be used to display or edit an object in JSON syntax:
 *
 * <code>
 * <pre><textarea json-text ng-model="myObject"/></pre>
 * </code>
 *
 * @param {string} json-valid AngularJS expression to bind parsing status to.
 *
 * @example 
 <example module="myApp">
  <file name="index.html">
    <div ng-controller="myController">
      valid: {{jsonOk}}
      <pre>{{data | json}}</pre>
      <textarea json-text ng-model="data" json-valid="jsonOk" style="width:100%" rows="12"></textarea>
    </div>
  </file>
  <file name="script.js">
    angular.module('myApp',['ngSKOS','jsonText']);

    function myController($scope) {
        $scope.data = {
            foo: [32, 42],
            bar: { 
                doz: true,
            },
        };
    }
  </file>
</example>
*/
.directive('jsonText',function(){
    return {
        restrict: 'AE',
        require: 'ngModel',
        scope: { 
//            jsonValid: '=' 
        },
        link: function(scope, element, attrs, ngModel) {
            scope.jsonValid = true;
            function fromJson(text) {
                try {
                    scope.jsonValid = true;
                   return angular.fromJson(text);
                } catch(e) {
                    scope.jsonValid = false;
                }
            }
            function toJson(object) {
                return angular.toJson(object, true);
            }
            ngModel.$parsers.push(fromJson);
            ngModel.$formatters.push(toJson);
            scope.$watch(attrs.ngModel, function(newValue, oldValue) {
                if (newValue != oldValue) {
                    ngModel.$setViewValue(toJson(newValue));
                    ngModel.$render();
                }
            }, true);
        }
    };
});


/**
 * @ngdoc overview
 * @name ng-skos
 * @module ng-skos
 * @description
 *
 * The main module <b>ngSKOS</b> contains several directives and services to
 * handle SKOS data. See the [developer guide](#guide) for an introduction and
 * the [API reference](#api) for documentation of the module.
 */
var ngSKOS = angular.module('ngSKOS',['ngSanitize']);
ngSKOS.value('version', '0.0.1');

/**
 * @ngdoc directive
 * @name ng-skos.directive:skosConcept
 * @restrict A
 * @scope
 * @description
 * 
 * Display a concept with a custom template.
 *
 * The following variables are added to the scope:
 * <ul>
 * <li>ancestors (array of concepts)
 * <li>prefLabel (object of strings)
 * <li>altLabel (object of array of strings)
 * <li>notation (string)
 * <li>note (object of array of strings)
 * <li>broader (array of concepts)
 * <li>narrower (array of concepts)
 * <li>related (array of concepts)
 * </ul>
 *
 * @param {string} skos-concept Assignable angular expression with 
 *      [concept](#/guide/concepts) data to bind to.
 * @param {string} language Assignable angular expression with 
 *      preferred language to be used as bounded `language` variable. 
 *
 * @example
 *
 */
ngSKOS.directive('skosConcept', function() {
    return {
        restrict: 'A',
        scope: { 
            concept: '=skosConcept',
            language: '=language',
        },
        templateUrl: function(element, attrs) {
            // TODO: use default if not specified
            return attrs.templateUrl; 
        },
        link: function link($scope, element, attr, controller, transclude) {

            $scope.update = function(concept) {
                if (concept) {
                    $scope.concept = concept;
                }
                // TODO: choose prefLabel by language attribute (?)
                angular.forEach(
                    ['uri','ancestors','prefLabel','altLabel','notation','narrower','broader','related'],
                    function(field) { 
                        $scope[field] = $scope.concept[field];
                        // TODO: add watcher/trigger
                    }
                );
            };
            // TODO: (re)load concept from server to get current details
            $scope.reload = function() { };

            $scope.update();
        }
    }
});

/**
 * @ngdoc directive
 * @name ng-skos.directive:skosLabel
 * @restrict A
 * @description
 *
 * Displays the preferred label of a concept.
 * Changes on the preferred label(s) are reflected in the display.
 *
 * @param {string} skos-label Assignable angular expression with 
 *      [concept](#/guide/concepts) data to bind to.
 * @param {string=} lang optional language. If not specified, an arbitrary
 *      preferred label is selected. Future versions of this directive may
 *      use more elaborated heuristics to select an alternative language.
 *
 * @example
 <example module="myApp">
  <file name="index.html">
    <div ng-controller="myController">
      <dl>
        <dt>en</dt>
        <dd><span skos-label="sampleConcept" lang="en"/></dd>
        <dt>de</dt>
        <dd><span skos-label="sampleConcept" lang="de"/></dd>
        <dt><input type="text" ng-model="lang2"/></dt>
        <dd><span skos-label="sampleConcept" lang="{{lang2}}"/></dd>
      </dl>
      <textarea json-text ng-model="sampleConcept" cols="40" rows="20" />
    </div>
  </file>
  <file name="script.js">
    angular.module('myApp',['ngSKOS','jsonText']);

    function myController($scope) {
        $scope.sampleConcept = {
            prefLabel: { 
                en: "example",
                de: "Beispiel",
            },
        };
        $scope.lang2 = "fr";
    }
  </file>
</example>
 */
ngSKOS.directive('skosLabel', function() {
    return {
        restrict: 'A',
        scope: { 
            concept: '=skosLabel',
        },
        template: '{{concept.prefLabel[language]}}',
        link: function(scope, element, attrs) {

            function updateLanguage(language) {
                scope.language = language ? language : attrs.lang;

                //console.log("updateLanguage: "+scope.language);
                //console.log(scope.concept.prefLabel);

                language = scope.concept 
                         ? selectLanguage(scope.concept.prefLabel, scope.language) : "";

                if (language != scope.language) {
                    // console.log("use language "+language+" instead of "+scope.language);
                    scope.language = language;
                }
            }

            function selectLanguage(labels, language) {
                if ( angular.isObject(labels) ) {
                    if ( language && labels[language] ) {
                        return language;
                    } else {
                        for (language in labels) {
                            return language;
                        }
                    }
                }
            }

            // update if lang attribute changed (also called once at initialization)
            attrs.$observe('lang', updateLanguage);

            // update with same language if prefLabels changed
            scope.$watch('concept.prefLabel', function(value) {
                updateLanguage();
            }, true);
        },
    };
});

/**
 * @ngdoc directive
 * @name ng-skos.directive:skosMapping
 * @restrict A
 * @description
 *
 * ...
 *
 * @param {string} skos-mapping ...
 *
 * @example
 <example module="myApp">
  <file name="index.html">
    <div ng-controller="myController">
      ...
    </div>
  </file>
  <file name="script.js">
    angular.module('myApp',['ngSKOS']);

    function myController($scope) {
        // ...
    }
  </file>
</example>
 */
ngSKOS.directive('skosMapping', function() {
    return {
        restrict: 'A',
        scope: {
					mapping: '=skosMapping',
        },
        templateUrl: function(element, attrs) {
            // TODO: use default if not specified
            return attrs.templateUrl; 
        },
        link: function(scope, element, attr, controller, transclude) {
					
                angular.forEach(
                    ['from','to','type','timestamp'],
                    function(field) { 
                        scope[field] = scope.mapping[field];
                        // TODO: add watcher/trigger
                    }
                );					
            // ...
        },
    };
});

/**
 * @ngdoc directive
 * @name ng-skos.directive:skosOccurrences
 * @restrict A
 * @description
 *
 * ...
 *
 * @param {string} skos-occurrences ...
 *
 * @example
 <example module="myApp">
  <file name="index.html">
    <div ng-controller="myController">
      ...
    </div>
  </file>
  <file name="script.js">
    angular.module('myApp',['ngSKOS']);

    function myController($scope) {
        // ...
    }
  </file>
</example>
 */
ngSKOS.directive('skosOccurrences', function() {
    return {
        restrict: 'A',
        scope: {
					occurrence:'=skosOccurrences',
        },
        templateUrl: function(element, attrs) {
            // TODO: use default if not specified
            return attrs.templateUrl;
        },
				link: function link(scope, element, attr, controller, transclude) {
					angular.forEach(
						['search','database','target','total','hits'],
						function(field) { 
              scope[field] = scope.occurrence[field];
							// TODO: add watcher/trigger
						}
					);
				}
    };
});

/**
 * @ngdoc directive
 * @name ng-skos.directive:skosSearch
 * @restrict A
 * @description
 *
 * ...
 *
 * @param {string} skos-search ...
 *
 * @example
 <example module="myApp">
  <file name="index.html">
    <div ng-controller="myController">
      ...
    </div>
  </file>
  <file name="script.js">
    angular.module('myApp',['ngSKOS']);

    function myController($scope) {
        // ...
    }
  </file>
</example>
 */
ngSKOS.directive('skosSearch', function() {
    return {
        restrict: 'A',
        scope: {
            // ...
        },
        template: '...',
        link: function(scope, element, attrs) {
            // ...
        },
    };
});

/**
 * @ngdoc directive
 * @name ng-skos.directive:skosTree
 * @restrict A
 * @description
 *
 * ...
 *
 * @param {string} skos-tree ...
 *
 * @example
 <example module="myApp">
  <file name="index.html">
    <div ng-controller="myController">
      ...
    </div>
  </file>
  <file name="script.js">
    angular.module('myApp',['ngSKOS']);

    function myController($scope) {
        // ...
    }
  </file>
</example>
 */
ngSKOS.directive('skosTree', function() {
    return {
        restrict: 'A',
        scope: {
            tree:'=skosTree',
        },
        templateUrl: function(element, attrs) {
            // TODO: use default if not specified
            return attrs.templateUrl;
        },
        link: function(scope, element, attr, controller, transclude) {
					angular.forEach(
						['uri','prefLabel','notation','narrower'],
						function(field) { 
							scope[field] = scope.tree[field];
								// TODO: add watcher/trigger
						}
          );					
            // ...
        },				
    };
});

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
