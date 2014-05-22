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
 * @param {string} template-url URL of a template to display the concept
 *
 */
angular.module('ngSKOS').directive('skosConcept', function () {
  return {
    restrict: 'AE',
    scope: {
      concept: '=skosConcept',
      language: '=language'
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
          scope[field] = concept[field];
        });
      }, true);
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
    template: '{{concept.prefLabel[language]}}',
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
 * @name ng-skos.directive:skosMapping
 * @restrict A
 * @description
 *
 * This directive displays a [mapping](#/guide/mappings) between concepts of
 * two concept schemes.
 *
 * ## Source code
 *
 * The most recent [source 
 * code](https://github.com/gbv/ng-skos/blob/master/src/directives/skosMapping.js)
 * of this directive is available at GitHub.
 *
 * @param {string} skos-mapping Mapping to display
 * @param {string} template-url URL of a template to display the mapping
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
angular.module('ngSKOS').directive('skosMapping', function () {
  return {
    restrict: 'A',
    scope: { mapping: '=skosMapping' },
    templateUrl: function (elem, attrs) {
      return attrs.templateUrl ? attrs.templateUrl : 'template/skos-mapping.html';
    },
    link: function (scope, element, attr, controller, transclude) {
      angular.forEach([
        'from',
        'to',
        'type',
        'timestamp'
      ], function (field) {
        scope[field] = scope.mapping[field];  // TODO: add watcher/trigger
      });  // ...
    }
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
        console.log(contents);
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
 * @name ng-skos.service:SkosConceptProvider
 * @description
 * 
 * Get concepts via HTTP.
 * 
 * ## Methods
 *
 * * getConcept
 * * updateConcept
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
  '$http',
  '$q',
  function ($http, $q) {
    // constructor
    var SkosConceptProvider = function (args) {
      this.transform = args.transform;
      this.url = args.url;
      this.jsonp = typeof args.jsonp === 'undefined' || args.jsonp === '' ? true : !!args.jsonp;
    };
    // methods
    SkosConceptProvider.prototype = {
      getConcept: function (concept) {
        var url;
        if (this.url) {
          url = this.url;
          var notation = concept.notation[0];
          url = url.replace('{uri}', decodeURIComponent(concept.uri));
          url = url.replace('{notation}', decodeURIComponent(notation));  // TODO: prefLabel
        } else {
          url = concept.uri;
        }
        var transform = this.transform;
        // TODO: if jsonp
        var method = this.jsonp ? $http.jsonp : $http.get;
        return method(url).then(function (response) {
          try {
            return transform ? transform(response.data) : response.data;
          } catch (e) {
            return $q.reject(e);
          }
        }, function (response) {
          return $q.reject(response.data);
        });
      },
      updateConcept: function (concept) {
        return this.getConcept(concept).then(function (response) {
          angular.copy(response, concept);
        });
      }
    };
    return SkosConceptProvider;
  }
]);
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
angular.module('ngSKOS').factory('skosAccess', function () {
  // TODO: use $angularCacheFactory for caching
  return function (source) {
    var provider = this;
    if (!source) {
      source = {
        concept: function (uri, callback) {
          callback({ uri: uri });
        },
        terminology: function (uri, callback) {
          callback({ uri: uri });
        }
      };
    }
    ;
    this.source = source;
    this.getConcept = function (uri, callback) {
      // TODO: caching, use this
      provider.source.concept(uri, callback);
    };
    this.getTerminology = function (uri) {
      // TODO: caching, use this.
      provider.source.terminology(uri, callback);
    };
    this.getConcepts = function (concepts) {
      angular.forEach(concepts, function (key, value) {
        if (typeof value !== 'object') {
          // excludes null 
          provider.getConcept(value, function (concept) {
            concepts[key] = concept;
          });
        }
      });
    };
    return provider;
  };
});
angular.module('ngSKOS').run([
  '$templateCache',
  function ($templateCache) {
    'use strict';
    $templateCache.put('template/skos-concept-thesaurus.html', '<div class="skos-concept-thesaurus"><ul ng-if="ancestors.length" class="ancestors"><span ng-if="inScheme" class="classification">{{inScheme}}</span><li class="ancestor" ng-repeat="a in ancestors"><span skos-label="a" lang="{{language}}" ng-click="update(a);reload();"></span></li></ul><div class="top top-classic"><span ng-if="notation" class="notation">{{notation[0]}}</span> <b><span skos-label="concept" lang="{{language}}"></span></b><a ng-if="notation" class="uri" href="{{uri}}"><span style="vertical-align:-10%" class="glyphicon glyphicon-globe"></span></a></div><div ng-if="broader.length" class="broader"><b>Broader Terms:</b><ul ng-repeat="b in broader" ng-click="update(b);reload();"><li><span skos-label="b" lang="{{language}}"></li></ul></div><div ng-if="narrower.length" class="narrower"><b>Narrower Terms:</b><ul ng-repeat="n in narrower" ng-click="update(n);reload();"><li><span skos-label="n" lang="{{language}}"></li></ul></div><div ng-if="related.length" class="related"><b>Related Terms:</b><ul ng-repeat="r in related" ng-click="update(r);reload();"><li><span skos-label="r" lang="{{language}}"></li></ul></div></div>');
    $templateCache.put('template/skos-concept.html', '<div class="skos-concept"><div class="top top-alt"><span ng-if="notation" class="notation">{{notation[0]}}</span> <b><span skos-label="concept" lang="{{language}}"></span></b><a ng-if="notation" class="uri" href="{{uri}}"><span class="glyphicon glyphicon-globe"></span></a></div><div ng-if="broader.length" class="broader"><ul ng-repeat="c in broader" ng-click="update(c);reload();"><li>&#8598; <span skos-label="c" lang="{{language}}"></li></ul></div><div ng-if="narrower.length" class="narrower"><ul ng-repeat="c in narrower" ng-click="update(c);reload();"><li>&#8600; <span skos-label="c" lang="{{language}}"></li></ul></div><div ng-if="related.length" class="related"><ul ng-repeat="c in related" ng-click="update(c);reload();"><li>&#10137; <span skos-label="c" lang="{{language}}"></li></ul></div></div>');
    $templateCache.put('template/skos-mapping.html', '<div class="skos-mapping"><div class="mappingResults"><div class="mappingResults-from"><div class="mapping-label"><span class="classification">{{from[0].inScheme.notation[0]}}</span></div><ul><li ng-repeat="from in from"><span class="notation" popover="{{from.prefLabel.en}}" popover-trigger="mouseenter">{{from.notation[0]}}</span></li></ul></div><div class="mappingResults-icon"><big><span ng-if="from.length" class="glyphicon glyphicon-arrow-right"></span></big></div><div class="mappingResults-to"><div class="mapping-label"><span class="classification">{{to[0].inScheme.notation[0]}}</span></div><ul><li ng-repeat="target in to"><span class="notation" popover="{{target.prefLabel.en}}" popover-trigger="mouseenter">{{target.notation[0]}}</span></li></ul></div></div><div class="mappingFoot"><ul ng-if="from.length"><li><span><b>Type:</b></span> <span>{{type}}</span> <span><b>Date added:</b></span> <span>{{timestamp}}</span></li></ul></div></div>');
    $templateCache.put('template/skos-occurrences.html', '<div class="skos-occurrences"><div class="skos-occurrences occ-details"><table><tr><td>Used notation:</td><td><span ng-if="search.length" class="notation" popover="{{search[0].prefLabel.en}}" popover-trigger="mouseenter">{{search[0].notation[0]}}</span></td></tr><tr><td><b>Used</b> concept scheme:</td><td><span ng-if="search.length" class="classification">{{search[0].inScheme.notation[0]}}</span></td></tr><tr><td><b>Target</b> concept scheme:</td><td><span ng-if="search.length" class="classification">{{target.notation[0]}}</span></td></tr><tr><td>Used database:</td><td><span ng-if="search.length" class="dbase">{{database.notation[0]}}</span></td></tr><tr ng-if="search.length"><td>Results (total) for <span ng-if="search.length" class="notation" popover="{{search[0].prefLabel.en}}" popover-trigger="mouseenter">{{search[0].notation[0]}}</span>:</td><td>{{total}}</td></tr></table></div><div class="skos-occurrences occ-results">Corresponding notations in <span ng-if="search.length" class="classification">{{target.notation[0]}}</span>:<table ng-if="search.length" class="table table-hover table-striped table-condensed table-bordered"><thead><tr><th>Notation</th><th>total</th><th>% of total results</th></tr></thead><tbody><tr ng-repeat="not in hits"><td><span ng-if="not.length" class="notation" popover="{{not[0].prefLabel.en}}" popover-trigger="mouseenter">{{not[0].notation[0]}}</span></td><td>{{not[1]}}</td><td>{{not[1]/total*100 | number:1}} %</td></tr></tbody></table></div></div>');
    $templateCache.put('template/skos-search.html', '<div class="concept concept-search"></div>');
    $templateCache.put('template/skos-tree.html', '<div class="skos-tree"><p class="set"><span ng-if="tree.notation" class="notation">{{tree.notation[0]}}</span> <span class="nlabel">{{ tree.prefLabel.en }}</span></p><ul><li ng-repeat="n in tree.narrower"><span skos-tree="n"></span></li></ul></div>');
  }
]);