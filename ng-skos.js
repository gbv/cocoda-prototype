/**
 * @ngdoc overview
 * @name json-text
 * @module json-text
 * @description
 *
 * This utility module provides directive {@link json-text.directive:jsonText 
 * jsonText} for directly displaying or editing JSON objects as text strings.
 */
angular.module('jsonText', []).directive('jsonText', function () {
  return {
    restrict: 'AE',
    require: 'ngModel',
    scope: {},
    link: function (scope, element, attrs, ngModel) {
      scope.jsonValid = true;
      function fromJson(text) {
        try {
          scope.jsonValid = true;
          return angular.fromJson(text);
        } catch (e) {
          scope.jsonValid = false;
        }
      }
      function toJson(object) {
        return angular.toJson(object, true);
      }
      ngModel.$parsers.push(fromJson);
      ngModel.$formatters.push(toJson);
      scope.$watch(attrs.ngModel, function (newValue, oldValue) {
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
angular.module('ngSKOS', ['ngSanitize']).value('version', '0.0.1');
/**
 * @ngdoc directive
 * @name ng-skos.directive:skosConcept
 * @restrict A
 * @scope
 * @description
 * 
 * Display a ng-skos [concept](#/guide/concepts). Changes on the concept are
 * reflected by changes in the scope variables so the display is updated
 * automatically.
 *
 * ## Scope
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
 * ## Source code
 *
 * The most recent 
 * [source code](https://github.com/gbv/ng-skos/blob/master/src/directives/skosConcept.js)
 * of this directive is available at GitHub.
 * 
 * @param {string} skos-concept Assignable angular expression with a
 *      [concept](#/guide/concepts) to bind to
 * @param {string} language Assignable angular expression with 
 *      preferred language to be used as bounded `language` variable. 
 * @param {string} skos-click function to call when a connected concept is clicked
 * @param {string} template-url URL of a template to display the concept
 *
 */
angular.module('ngSKOS').directive('skosConcept', function () {
  return {
    restrict: 'AE',
    scope: {
      concept: '=skosConcept',
      language: '=language',
      click: '=skosClick'
    },
    templateUrl: function (elem, attrs) {
      return attrs.templateUrl ? attrs.templateUrl : 'template/skos-concept.html';
    },
    link: function link(scope, element, attr) {
      scope.$watch('concept', function (concept) {
        angular.forEach([
          'uri',
          'inScheme',
          'ancestors',
          'prefLabel',
          'altLabel',
          'note',
          'notation',
          'narrower',
          'broader',
          'related'
        ], function (field) {
          scope[field] = concept ? concept[field] : null;
        });
      }, true);
    }
  };
});
/**
 * @ngdoc directive
 * @name ng-skos.directive:skosConceptList
 * @restrict A
 * @description
 *
 * This directive displays a list of [concepts](#/guide/concepts) with options to manipulate those lists.
 *
 * ## Source code
 *
 * The most recent [source 
 * code](https://github.com/gbv/ng-skos/blob/master/src/directives/skosConceptList.js)
 * of this directive is available at GitHub.
 *
 * @param {string} skosConceptList Object containing an array of concepts
 * @param {string} onSelect function handling the selection of one list item
 * @param {string} templateUrl URL of a template to display the concept list
 *
*/
angular.module('ngSKOS').directive('skosConceptList', function () {
  return {
    restrict: 'A',
    scope: {
      concepts: '=skosConceptList',
      onSelect: '=onSelect'
    },
    templateUrl: function (elem, attrs) {
      return attrs.templateUrl ? attrs.templateUrl : 'template/skos-concept-list.html';
    },
    link: function link(scope, element, attr) {
      scope.removeConcept = function (index) {
        scope.concepts.splice(index, 1);
      };
      scope.$watch('concepts');
    }
  };
});
/**
 * @ngdoc directive
 * @name ng-skos.directive:skosConceptMapping
 * @restrict A
 * @description
 *
 * This directive displays two lists of [concepts](#/guide/concepts) for the purpose of mapping from one concept scheme to another. In addition, it provides tools to customize and export those [mappings](#/guide/mappings).
 *
 * ## Source code
 *
 * The most recent [source 
 * code](https://github.com/gbv/ng-skos/blob/master/src/directives/skosConceptMapping.js)
 * of this directive is available at GitHub.
 *
 * @param {string} mapping Mapping to display
 * @param {string} from Name of the current source scheme
 * @param {string} to Name of the current target scheme
 * @param {string} select function to export a single concept scheme
 * @param {string} saveLocation function to save the current mapping
 * @param {string} templateUrl URL of a template to display the mapping
 *
*/
angular.module('ngSKOS').directive('skosConceptMapping', function () {
  return {
    restrict: 'A',
    scope: {
      mapping: '=skosConceptMapping',
      from: '=mappingFrom',
      to: '=mappingTo',
      select: '=select',
      saveLocation: '=saveLocation'
    },
    templateUrl: function (elem, attrs) {
      return attrs.templateUrl ? attrs.templateUrl : 'template/skos-concept-mapping.html';
    },
    link: function link(scope, element, attr) {
      scope.selectFrom = function (concept) {
        scope.select('origin', concept);
      };
      scope.selectTo = function (concept) {
        scope.select('target', concept);
      };
      scope.saveMapping = function () {
        scope.mapping.timestamp = new Date().toISOString().slice(0, 10);
        // TODO: Use own database to specify 'source'
        scope.mapping.source = function () {
        };  // TODO: Save current mapping to 'saveLocation'
      };
      scope.$watch('mapping');
    }
  };
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
angular.module('ngSKOS').directive('skosLabel', function () {
  return {
    restrict: 'A',
    scope: { concept: '=skosLabel' },
    template: '{{concept.prefLabel[language] ? concept.prefLabel[language] : "???"}}',
    link: function (scope, element, attrs) {
      function updateLanguage(language) {
        scope.language = language ? language : attrs.lang;
        //console.log("updateLanguage: "+scope.language);
        //console.log(scope.concept.prefLabel);
        language = scope.concept ? selectLanguage(scope.concept.prefLabel, scope.language) : '';
        if (language != scope.language) {
          // console.log("use language "+language+" instead of "+scope.language);
          scope.language = language;
        }
      }
      function selectLanguage(labels, language) {
        if (angular.isObject(labels)) {
          if (language && labels[language]) {
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
      scope.$watch('concept.prefLabel', function (value) {
        updateLanguage();
      }, true);
    }
  };
});
/**
 * @ngdoc directive
 * @name ng-skos.directive:skosMappingCollection
 * @restrict A
 * @description
 *
 * This directive displays mapping tables between [concepts](#/guide/concepts) of
 * two concept schemes.
 *
 * ## Source code
 *
 * The most recent [source 
 * code](https://github.com/gbv/ng-skos/blob/master/src/directives/skosMappingCollection.js)
 * of this directive is available at GitHub.
 *
 * @param {string} skos-mapping-collection Mapping to display
 * @param {string} use-mapping function to handle mappings selected from within this template
 * @param {string} template-url URL of a template to display the mapping
 *
 * @example
 <example module="myApp">
  <file name="index.html">
    <div ng-controller="myController">
      <div skos-mapping-collection="exampleMappings">
      </div>
    </div>
  </file>
  <file name="script.js">
    angular.module('myApp',['ngSKOS']);

    function myController($scope) {
        $scope.exampleMappings = {
            [{
                source1: [{
                    origin1: [{
                        target1: [{
                            from: [{
                                notation: [ '12345' ],
                                prefLabel: { en: 'originLabel1' },
                                inScheme: { notation: ['origin'] }
                            }],
                            to: [{
                                notation: [ 'ABC' ],
                                prefLabel: { en: 'targetLabel1' },
                                inSchemen: { notation: ['target'] }
                            }
                            type: 'strong',
                            timestamp: '2014-01-01',
                            source: 'source'
                        },
                        {
                            from: [{
                                notation: [ '98765' ],
                                prefLabel: { en: 'originLabel2' },
                                inScheme: { notation: ['origin'] }
                            }],
                            to: [{
                                notation: [ 'DEF' ],
                                prefLabel: { en: 'targetLabel2' },
                                inSchemen: { notation: ['target'] }
                            }
                            type: 'medium',
                            timestamp: '2010-05-05',
                            source: 'source'
                        }]
                    }]
                }]
            },
            {
                source2: [{}]
            }]
        }
    }
  </file>
</example>
 */
angular.module('ngSKOS').directive('skosMappingCollection', function () {
  return {
    restrict: 'A',
    scope: {
      mappings: '=skosMappingCollection',
      useMapping: '=useMapping'
    },
    templateUrl: function (elem, attrs) {
      return attrs.templateUrl ? attrs.templateUrl : 'template/skos-mapping-collection.html';
    },
    link: function (scope, element, attr, controller, transclude) {
    }  // ...
  };
});
/**
 * @ngdoc directive
 * @name ng-skos.directive:skosMappingTable
 * @restrict A
 * @description
 *
 * This directive displays [mappings](#/guide/mappings) between concepts of
 * two concept schemes in a table format.
 *
 * ## Source code
 *
 * The most recent [source 
 * code](https://github.com/gbv/ng-skos/blob/master/src/directives/skosMappingTable.js)
 * of this directive is available at GitHub.
 *
 * @param {string} skos-mapping-table Mapping to display
 * @param {string} select-mapping function to handle mappings selected from within this template
 * @param {string} template-url URL of a template to display the mapping
 *
 * @example
 <example module="myApp">
  <file name="index.html">
    <div ng-controller="myController">
      <div skos-mapping-table="exampleMappings">
      </div>
    </div>
  </file>
  <file name="script.js">
    angular.module('myApp',['ngSKOS']);

    function myController($scope) {
        $scope.exampleMappings = {
            [{
                from: [{
                    notation: [ '12345' ],
                    prefLabel: { en: 'originLabel1' },
                    inScheme: { notation: ['origin'] }
                }],
                to: [{
                    notation: [ 'ABC' ],
                    prefLabel: { en: 'targetLabel1' },
                    inSchemen: { notation: ['target'] }
                }
                type: 'strong',
                timestamp: '2014-01-01',
                source: 'source'
            },
            {
                from: [{
                    notation: [ '98765' ],
                    prefLabel: { en: 'originLabel2' },
                    inScheme: { notation: ['origin'] }
                }],
                to: [{
                    notation: [ 'DEF' ],
                    prefLabel: { en: 'targetLabel2' },
                    inSchemen: { notation: ['target'] }
                }
                type: 'medium',
                timestamp: '2010-05-05',
                source: 'source'
            }]

        }
    }
  </file>
</example>
 */
angular.module('ngSKOS').directive('skosMappingTable', function () {
  return {
    restrict: 'A',
    scope: {
      mapping: '=skosMappingTable',
      select: '=selectMapping'
    },
    templateUrl: function (elem, attrs) {
      return attrs.templateUrl ? attrs.templateUrl : 'template/skos-mapping-table.html';
    },
    link: function (scope, element, attr, controller, transclude) {
    }  // ...
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
 * @param {string} template-url URL of a template to display the occurrences
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
angular.module('ngSKOS').directive('skosOccurrences', function () {
  return {
    restrict: 'A',
    scope: { occurrence: '=skosOccurrences' },
    templateUrl: function (elem, attrs) {
      return attrs.templateUrl ? attrs.templateUrl : 'template/skos-occurrences.html';
    },
    link: function link(scope, element, attr, controller, transclude) {
      angular.forEach([
        'search',
        'database',
        'target',
        'total',
        'hits'
      ], function (field) {
        scope[field] = scope.occurrence[field];  // TODO: add watcher/trigger
      });
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
 * @param {string} template-url URL of a template to display the search
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
angular.module('ngSKOS').directive('skosSearch', function () {
  return {
    restrict: 'A',
    scope: {},
    templateUrl: function (elem, attrs) {
      return attrs.templateUrl ? attrs.templateUrl : 'template/skos-search.html';
    },
    link: function (scope, element, attrs) {
    }
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
 * ## Source code
 *
 * The most recent [source 
 * code](https://github.com/gbv/ng-skos/blob/master/src/directives/skosTree.js)
 * of this directive is available at GitHub.
 *
 * @param {string} skos-tree Tree to display
 * @param {string} template-url URL of a template to display the tree
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
angular.module('ngSKOS').directive('skosTree', [
  '$compile',
  function ($compile) {
    return {
      restrict: 'A',
      transclude: true,
      scope: { tree: '=skosTree' },
      templateUrl: function (elem, attrs) {
        return attrs.templateUrl ? attrs.templateUrl : 'template/skos-tree.html';
      },
      compile: function (tElement, tAttr, transclude) {
        var contents = tElement.contents().remove();
        var compiledContents;
        return function (scope, iElement, iAttr) {
          if (!compiledContents) {
            compiledContents = $compile(contents, transclude);
          }
          compiledContents(scope, function (clone, scope) {
            iElement.append(clone);
          });
        };
      }
    };
  }
]);
/**
 * @ngdoc service
 * @name ng-skos.service:SkosConceptListProvider
 * @description
 * 
 * Get an ordered list of concepts via HTTP.
 *
 * The server to be queried with this service is expected to return a list with
 * [concept](#/guide/concepts) objects.
 * 
 * ## Configuration
 * 
 * * **`url`**: URL template to get the list from
 * * **`jsonp`**: enable JSONP
 * * **`transform`**: transformation function to map to expected response format
 *
 * ## Methods
 *
 * * **`getConceptList()`**
 * * **`updateConceptList(list)`**
 *
 */
angular.module('ngSKOS').factory('SkosConceptListProvider', [
  'SkosProvider',
  function (SkosProvider) {
    // inherit from SkosProvider
    var SkosConceptListProvider = function (args) {
      SkosProvider.call(this, args);
    };
    SkosConceptListProvider.prototype = new SkosProvider();
    SkosConceptListProvider.prototype.getConceptList = function () {
      return this.get();
    };
    SkosConceptListProvider.prototype.updateConceptList = function () {
      return this.getConceptList(list).then(function (response) {
        angular.copy(response, list);
      });
    };
    return SkosConceptListProvider;
  }
]);
/**
 * @ngdoc service
 * @name ng-skos.service:SkosConceptProvider
 * @description
 * 
 * Get concepts via HTTP. 
 *
 * The server to be queried with this service is expected to return a JSON
 * object with one [concept](#/guide/concepts). The concept object may contain
 * links to narrower and broader concepts, among other information.
 * 
 * ## Configuration
 * 
 * * **`url`**: URL template for requests
 * * **`jsonp`**: enable JSONP
 * * **`transform`**: custom transformation function to map expected response format
 *
 * ## Methods
 *
 * * **`getConcept(concept)`**
 * * **`updateConcept(concept)`**
 * * **`updateConnected(concept)`**
 *
 * @example
 *  <example module="myApp">
 *    <file name="index.html">
 *      <div ng-controller="myController">
 *      </div>
 *    </file>
 *    <file name="script.js">
 *      angular.module('myApp',['ngSKOS']);
 *      function myController($scope, SkosConceptProvider) {
 *          var foo = new SkosConceptProvider({
 *              url: '...'
 *          });
 *      }
 *    </file>
 *  </example>
 */
angular.module('ngSKOS').factory('SkosConceptProvider', [
  'SkosProvider',
  function (SkosProvider) {
    // inherit from SkosProvider
    var SkosConceptProvider = function (args) {
      SkosProvider.call(this, args);
    };
    SkosConceptProvider.prototype = new SkosProvider();
    SkosConceptProvider.prototype.getConcept = function (concept) {
      var url;
      // look up by uri / notation / prefLabel
      if (this.url) {
        if (angular.isFunction(this.url)) {
          url = this.url(concept);
        } else {
          url = this.url;
          if (concept.notation) {
            var notation = concept.notation[0];
            url = url.replace('{notation}', decodeURIComponent(notation));
          } else {
            url = url.replace('{uri}', decodeURIComponent(concept.uri));
          }
        }
      } else {
        url = concept.uri;
      }
      return this.get(url);
    };
    SkosConceptProvider.prototype.updateConcept = function (concept) {
      return this.getConcept(concept).then(function (response) {
        angular.copy(response, concept);
      });
    };
    SkosConceptProvider.prototype.updateConnected = function (concept, which) {
      if (angular.isString(which)) {
        which = [which];
      } else if (!angular.isArray(which)) {
        which = [
          'broader',
          'narrower',
          'related'
        ];
      }
      var service = this;
      angular.forEach(which, function (w) {
        angular.forEach(concept[w], function (c) {
          service.updateConcept(c);
        });
      });
    };
    return SkosConceptProvider;
  }
]);
/**
 * @ngdoc service
 * @name ng-skos.service:SkosProvider
 * @description
 * 
 * Utility service to facilitate HTTP requests. 
 *
 * This service implements use of URL templates to perform HTTP requests with 
 * optional transformation of JSON responses and error handling. Directly use
 * [SkosConceptProvider](#/api/ng-skos.service:SkosConceptProvider) and
 * [SkosConceptListProvider](#/api/ng-skos.service:SkosConceptListProvider)
 * instead.
 * 
 * ## Configuration
 * 
 * * **`url`**: URL template for requests
 * * **`jsonp`**: enable JSONP
 * * **`transform`**: custom transformation function to map expected response format
 *
 * ## Methods
 *
 * * **`get([url])`**: perform a HTTP request
 *
 */
angular.module('ngSKOS').factory('SkosProvider', [
  '$http',
  '$q',
  function ($http, $q) {
    // constructor
    var SkosProvider = function (args) {
      if (!args) {
        args = {};
      }
      this.transform = args.transform;
      this.url = args.url;
      var jsonp = args.jsonp;
      if (jsonp && (jsonp === true || angular.isNumber(jsonp) || jsonp.match(/^\d/))) {
        jsonp = 'callback';
      }
      this.jsonp = jsonp;
    };
    SkosProvider.prototype = {
      get: function (url) {
        if (!url) {
          url = this.url;
        }
        var transform = this.transform;
        var get = $http.get;
        if (this.jsonp) {
          get = $http.jsonp;
          url += url.indexOf('?') == -1 ? '?' : '&';
          url += this.jsonp + '=JSON_CALLBACK';
        }
        return get(url).then(function (response) {
          try {
            return transform ? transform(response.data) : response.data;
          } catch (e) {
            console.error(e);
            return $q.reject(e);
          }
        }, function (response) {
          console.error(response);
          return $q.reject(response.data);
        });
      }
    };
    return SkosProvider;
  }
]);
angular.module('ngSKOS').run([
  '$templateCache',
  function ($templateCache) {
    'use strict';
    $templateCache.put('template/skos-concept-list.html', '<div><ul ng-if="concepts.length" style="list-style-type:none;padding-left:0px"><li ng-repeat="c in concepts" style="max-width:280px;display:block"><span class="notation" popover="{{c.prefLabel.de}}" popover-trigger="mouseenter">{{c.notation[0]}}</span> <span>{{c.prefLabel.de}}</span> <a href="#" ng-click="onSelect(c)"><span class="glyphicon glyphicon-search"></span></a> <a href="#" ng-click="removeConcept($index)"><span class="glyphicon glyphicon-trash"></span></a></li></ul></div>');
    $templateCache.put('template/skos-concept-mapping.html', '<div><div ng-if="!from.length && !to.length" style="margin-top:50px;margin-bottom:40px;text-align:center"><em>Please choose a concept scheme for mapping</em></div><div ng-if="from.length && to.length && !mapping.from.length && !mapping.to.length" style="margin-top:10px;margin-bottom:5px;text-align:center"><em>Please search for terms in the current concept schemes</em></div><div ng-if="mapping.from.length && !from.length && !to.length" style="margin-top:10px;margin-bottom:5px;text-align:center"><em>Please choose a term to work on</em></div><div ng-if="from.length || mapping.to[0].notation.length" style="width:100%"><table style="width:95%;margin:0 auto;align:center"><thead style="text-align:center;list-style-type:none;padding-left:0px"><tr><th style="width:400px"><span ng-if="from.length" class="classification">{{from}}</span></th><th style="width:24px"></th><th style="width:400px;text-align:right"><span ng-if="to.length" class="classification">{{to}}</span></th></tr></thead><tbody><tr><td><div class="tmpl-border mappingResults-from"><div ng-if="mapping.from.length" skos-concept-list="mapping.from" on-select="selectFrom"></div><div ng-if="!mapping.from.length"><em>Please select a mapping term</em></div></div></td><td><div style="margin:30px auto"><big><span class="glyphicon glyphicon-arrow-right"></span></big></div></td><td><div class="tmpl-border mappingResults-to" style="float:right"><div ng-if="mapping.to.length" skos-concept-list="mapping.to" on-select="selectTo"></div><div ng-if="!mapping.to.length"><em>Please select a mapping term</em></div></div></td></tr></tbody></table></div><div ng-if="from.length && to.length"><div style="width:95%;margin:0 auto"><div style="border:1px solid #eee;float:left;margin-bottom:5px;padding:4px"><div><span style="margin-left:12px">Choose mapping strength:</span></div><form style="margin-right:10px;display:inline"><input style="margin-right:12px;margin-left:12px" type="radio" name="strengthtype" ng-model="mapping.type" value="">none<input style="margin-right:12px;margin-left:12px" type="radio" name="strengthtype" ng-model="mapping.type" value="strong">strong<input style="margin-right:12px;margin-left:12px" type="radio" name="strengthtype" ng-model="mapping.type" value="medium">medium<input style="margin-right:12px;margin-left:12px" type="radio" name="strengthtype" ng-model="mapping.type" value="weak">weak</form></div><div style="float:right;margin-top:10px"><button ng-click="saveMapping()" ng-disabled="!mapping.from.length || !mapping.to.length">Save current mapping</button></div></div></div></div>');
    $templateCache.put('template/skos-concept-thesaurus.html', '<div class="skos-concept-thesaurus"><ul ng-if="ancestors.length" class="ancestors"><span ng-if="inScheme" class="classification">{{inScheme}}</span><li class="ancestor" ng-repeat="a in ancestors"><span skos-label="a" lang="{{language}}" ng-click="update(a);reload();"></span></li></ul><div class="top top-classic"><span ng-if="notation" class="notation">{{notation[0]}}</span> <b><span skos-label="concept" lang="{{language}}"></span></b><a ng-if="notation" class="uri" href="{{uri}}"><span style="vertical-align:-10%" class="glyphicon glyphicon-globe"></span></a></div><div ng-if="altLabel.length" class="skos-concept-altlabel"><ul><li ng-repeat="alt in altLabel"><span ng-if="$index < 5" style="display:inline">{{alt}}</span> <span style="margin-left:-4px;margin-right:3px" ng-if="$index < 4 && $index < altLabel.length-1">,</span></li></ul></div><div ng-if="broader.length" class="skos-concept-thesaurus-relation"><b>Broader Terms:</b><ul ng-repeat="b in broader"><li><span skos-label="b" lang="{{language}}" ng-click="click(b)"></li></ul></div><div ng-if="narrower.length" class="skos-concept-thesaurus-relation"><b>Narrower Terms:</b><ul ng-repeat="n in narrower"><li><span skos-label="n" lang="{{language}}" ng-click="click(n)"></li></ul></div><div ng-if="related.length" class="skos-concept-thesaurus-relation"><b>Related Terms:</b><ul ng-repeat="r in related"><li><span skos-label="r" lang="{{language}}" ng-click="click(r)"></li></ul></div></div>');
    $templateCache.put('template/skos-concept.html', '<div class="skos-concept"><div ng-if="uri" class="top top-alt"><span ng-if="notation" class="notation">{{notation[0]}}</span> <b><span skos-label="concept" lang="{{language}}"></span></b><a ng-if="notation" class="uri" href="{{uri}}" target="_blank"><span class="glyphicon glyphicon-globe"></span></a></div><div class="skos-concept-connected"><div class="skos-concept-altlabel"><ul><li ng-repeat="alt in altLabel"><span ng-if="$index < 5" style="display:inline">{{alt}}</span> <span style="margin-left:-4px;margin-right:3px" ng-if="$index < 4 && $index < altLabel.length-1">,</span></li></ul></div><div ng-if="broader.length" class="skos-concept-relation"><ul ng-repeat="c in broader"><li>&#8598; <span skos-label="c" lang="{{language}}" ng-click="click(c)"></span></li></ul></div><div ng-if="narrower.length" class="skos-concept-relation"><ul ng-repeat="c in narrower"><li>&#8600; <span skos-label="c" lang="{{language}}" ng-click="click(c)"></span></li></ul></div><div ng-if="related.length" class="skos-concept-relation"><ul ng-repeat="c in related"><li>&#10137; <span skos-label="c" lang="{{language}}" ng-click="click(c)"></span></li></ul></div><div ng-if="note">Note: <em>{{note.en[0]}}</em></div></div></div>');
    $templateCache.put('template/skos-mapping-collection.html', '<div ng-repeat="s in mappings"><span ng-repeat="(skey, source) in s"><span style="font-variant:small-caps"><big><b>{{skey}}</b></big></span><div ng-repeat="f in source"><span ng-repeat="(fkey, from) in f"><span ng-repeat="t in from"><span ng-repeat="(tkey, to) in t"><div skos-mapping-table="to" select-mapping="useMapping"></div></span></span></span></div></span></div>');
    $templateCache.put('template/skos-mapping-table.html', '<table style="white-space:nowrap" class="table table-hover table-striped table-condensed table-bordered"><thead><tr><th><span class="classification">{{mapping[0].from[0].inScheme.notation[0]}}</span></th><th><span class="classification">{{mapping[0].to[0].inScheme.notation[0]}}</span></th><th><span>Type</span></th><th><span>Date</span></th><th>Actions</th></tr></thead><tbody><tr ng-repeat="m in mapping"><td><ul style="list-style-type:none;padding-left:0px;margin-bottom:0px"><li ng-repeat="f in m.from"><span class="notation" popover="{{f.prefLabel.de}}" popover-trigger="mouseenter">{{f.notation[0]}}</span></li></ul></td><td><ul style="list-style-type:none;padding-left:0px;margin-bottom:0px"><li ng-repeat="t in m.to"><span class="notation" popover="{{t.prefLabel.de}}" popover-trigger="mouseenter">{{t.notation[0]}}</span></li></ul></td><td>{{m.type}}</td><td>{{m.timestamp}}</td><td style="text-align:center"><a ng-if="select" style="cursor:pointer" ng-click="select(m)"><span class="glyphicon glyphicon-check"></span></a></td></tr></tbody></table>');
    $templateCache.put('template/skos-mapping.html', '<div class="skos-mapping"><table style="width:100%"><thead><tr style="width:100%"><th style="width:45%"><span class="classification">{{mapping[0].from[0].inScheme.notation[0]}}</span></th><th style="width:10%"></th><th style="width:45%"><span class="classification">{{mapping[0].to[0].inScheme.notation[0]}}</span></th></tr></thead></table><div ng-repeat="m in mapping"><table style="width:100%"><thead><tr style="width:100%"><th style="width:45%"></th><th style="width:10%"></th><th style="width:45%"></th></tr></thead><tbody class="mappingResults"><tr style="vertical-align:top"><td><div class="mappingResults-from"><ul><li ng-repeat="from in m.from"><span class="notation" popover="{{from.prefLabel.en}}" popover-trigger="mouseenter">{{from.notation[0]}}</span></li></ul></div></td><td><div class="mappingResults-icon"><big><span ng-if="m.from.length || m.to.length" class="glyphicon glyphicon-arrow-right"></span></big></div></td><td><div class="mappingResults-to"><ul><li ng-repeat="target in m.to"><span class="notation" popover="{{target.prefLabel.en}}" popover-trigger="mouseenter">{{target.notation[0]}}</span></li></ul></div></td></tr></tbody></table><div class="mappingFoot"><ul ng-if="m.from.length"><li><span><b>Type:</b></span> <span>{{m.type}}</span> <span><b>Date added:</b></span> <span>{{m.timestamp}}</span> <span><b>Database:</b></span> <span>{{m.source}}</span> <button style="float:right" ng-click="useMapping(m)" ng-if="useMapping">Use</button></li></ul></div><div ng-if="$index < mapping.length-1" style="border-bottom:1px solid black;margin-bottom:5px"></div></div></div>');
    $templateCache.put('template/skos-occurrences.html', '<div class="skos-occurrences"><div class="skos-occurrences occ-details"><table><tr><td>Used notation:</td><td><span ng-if="search.length" class="notation" popover="{{search[0].prefLabel.en}}" popover-trigger="mouseenter">{{search[0].notation[0]}}</span></td></tr><tr><td><b>Used</b> concept scheme:</td><td><span ng-if="search.length" class="classification">{{search[0].inScheme.notation[0]}}</span></td></tr><tr><td><b>Target</b> concept scheme:</td><td><span ng-if="search.length" class="classification">{{target.notation[0]}}</span></td></tr><tr><td>Used database:</td><td><span ng-if="search.length" class="dbase">{{database.notation[0]}}</span></td></tr><tr ng-if="search.length"><td>Results (total) for <span ng-if="search.length" class="notation" popover="{{search[0].prefLabel.en}}" popover-trigger="mouseenter">{{search[0].notation[0]}}</span>:</td><td>{{total}}</td></tr></table></div><div class="skos-occurrences occ-results">Corresponding notations in <span ng-if="search.length" class="classification">{{target.notation[0]}}</span>:<table ng-if="search.length" class="table table-hover table-striped table-condensed table-bordered"><thead><tr><th>Notation</th><th>total</th><th>% of total results</th></tr></thead><tbody><tr ng-repeat="not in hits"><td><span ng-if="not.length" class="notation" popover="{{not[0].prefLabel.en}}" popover-trigger="mouseenter">{{not[0].notation[0]}}</span></td><td>{{not[1]}}</td><td>{{not[1]/total*100 | number:1}} %</td></tr></tbody></table></div></div>');
    $templateCache.put('template/skos-search.html', '<div class="concept concept-search"></div>');
    $templateCache.put('template/skos-tree.html', '<div class="skos-tree"><p class="set"><span ng-if="tree.notation" class="notation">{{tree.notation[0]}}</span> <span class="nlabel">{{ tree.prefLabel.de }}</span></p><ul><li ng-repeat="n in tree.narrower"><span skos-tree="n"></span></li></ul></div>');
  }
]);