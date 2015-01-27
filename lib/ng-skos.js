/**
 * @ngdoc overview
 * @name ng-skos
 * @module ng-skos
 * @description
 *
 * The main module <b>ngSKOS</b> contains several directives and services to
 * handle SKOS data. See the [API reference](#api) for module documentation.
 */
angular.module('ngSKOS', ['ngSanitize']).value('version', '0.0.2');
/**
 * @ngdoc directive
 * @name ng-skos.directive:skosBrowser
 * @restrict E
 * @scope
 * @description
 *
 * Provides a browsing interface to a concept scheme.
 *
 * The concept scheme must be provided as object with lookup functions to look
 * up a concept by URI (`lookupURI`), by notation (`lookupNotation`), and/or by
 * a unique preferred label (`lookupLabel`). Each lookup function, if given, 
 * must return an AngularJS promise to return a single concept in JSKOS format.
 * *Searching* in a concept scheme is not supported by this directive but one
 * can provide an additional OpenSearchSuggestion service (see
 * [ng-suggest](http://gbv.github.io/ng-suggest/)) with field `suggest`.
 *
 * ## Scope
 *
 * The following variables are added to the scope, if the corresponding
 * lookup function have been provided:
 *
 * <ul>
 * <li>selectURI
 * <li>selectNotation
 * <li>selectLabel
 * </ul>
 *
 * The current version only tries either one of this methods.
 *
 * The variable `loading` can be used to indicate loading delay.
 *
 * Suggestions are not fully supported yet.
 *
 * ## Customization
 *
 * The [default 
 * template](https://github.com/gbv/ng-skos/blob/master/src/templates/skos-browser.html)
 * can be changed with parameter `templateUrl`.
 *
 * ## Source code
 *
 * The most recent [source 
 * code](https://github.com/gbv/ng-skos/blob/master/src/directives/skosBrowser.js)
 * of this directive is available at GitHub.
 *
 * @param {string} concept selected [concept](http://gbv.github.io/jskos/jskos.html#concepts)
 * @param {string} concept scheme object with lookup methods
 * @param {string} template-url URL of a template to display the concept browser
 */
angular.module('ngSKOS').directive('skosBrowser', function () {
  return {
    restrict: 'E',
    scope: {
      concept: '=concept',
      scheme: '=conceptScheme'
    },
    templateUrl: function (elem, attrs) {
      return attrs.templateUrl ? attrs.templateUrl : 'template/skos-browser.html';
    },
    link: function link(scope, element, attr) {
      angular.forEach([
        'URI',
        'Notation',
        'Label'
      ], function (value) {
        var lookup = scope.scheme['lookup' + value];
        if (lookup) {
          scope['select' + value] = function (query) {
            console.log('skosBrowser.select' + value + ': ' + query);
            lookup(query).then(function (response) {
              angular.copy(response, scope.concept);
            });
          };
        }
      });
      scope.selectConcept = function (concept) {
        if (scope.selectURI && concept.uri) {
          scope.selectURI(concept.uri);
        } else if (scope.selectNotation && concept.notation && concept.notation.length) {
          scope.selectNotation(concept.notation);
        } else if (scope.selectLabel && concept.prefLabel) {
          scope.selectLabel(concept.prefLabel);
        }
      };
    }
  };
});
/**
 * @ngdoc directive
 * @name ng-skos.directive:skosConcept
 * @restrict A
 * @scope
 * @description
 * 
 * Display a [concept](http://gbv.github.io/jskos/jskos.html#concepts). 
 * Changes on the concept object are reflected by changes in the scope 
 * variables so the display is updated automatically.
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
 * In addition the helper method `isEmptyObject` is provided to check whether an object
 * is empty.
 *
 * ## Customization
 *
 * The [default
 * template](https://github.com/gbv/ng-skos/blob/master/src/templates/skos-concept.html) 
 * can be changed with parameter `templateUrl`.
 *
 * ## Source code
 *
 * The most recent [source 
 * code](https://github.com/gbv/ng-skos/blob/master/src/directives/skosConcept.js)
 * of this directive is available at GitHub.
 * 
 * @param {string} skos-concept Assignable angular expression with a
 *      [concept](http://gbv.github.io/jskos/jskos.html#concepts) to bind to
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
      scope.isEmptyObject = function (object) {
        var keys = Object.keys;
        return !(keys && keys.length);
      };
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
 * @name ng-skos.directive:skosLabel
 * @restrict A
 * @description
 *
 * Displays the preferred label of a concept.
 * Changes on the preferred label(s) are reflected in the display.
 *
 * ## Source code
 *
 * The most recent [source 
 * code](https://github.com/gbv/ng-skos/blob/master/src/directives/skosLabel.js)
 * of this directive is available at GitHub.
 *
 * @param {string} skos-label Assignable angular expression with 
 *      [concept](http://gbv.github.io/jskos/jskos.html#concepts) data to bind to.
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
      <pre>{{sampleConcept}}</pre>
    </div>
  </file>
  <file name="script.js">
    angular.module('myApp',['ngSKOS']);

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
    scope: { label: '=skosLabel' },
    template: '{{label[language] ? label[language] : label}}',
    link: function (scope, element, attrs) {
      function updateLanguage(language) {
        scope.language = language ? language : attrs.lang;
        language = scope.label ? selectLanguage(scope.label, scope.language) : '';
        if (language != scope.language) {
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
      scope.$watch('label', function (value) {
        updateLanguage();
      }, true);
    }
  };
});
/**
 * @ngdoc directive
 * @name ng-skos.directive:skosList
 * @restrict A
 * @description
 *
 * This directive displays a list of [concepts](http://gbv.github.io/jskos/jskos.html#concepts) 
 * with options to manipulate those lists.
 *
 * ## Customization
 *
 * The [default
 * template](https://github.com/gbv/ng-skos/blob/master/src/templates/skos-list.html) 
 * can be changed with parameter `templateUrl`.
 *
 * ## Source code
 *
 * The most recent [source 
 * code](https://github.com/gbv/ng-skos/blob/master/src/directives/skosList.js)
 * of this directive is available at GitHub.
 *
 * @param {string} concepts array of JSKOS concepts to display
 * @param {string} onSelect function handling the selection of one concept
 * @param {string} canRemove support a `removeConcept` method to remove concepts
 * @param {string} showLabels chose, if concept labels should be shown as well as notations
 * @param {string} templateUrl URL of a template to display the concept list
 *
 */
angular.module('ngSKOS').directive('skosList', [
  '$timeout',
  function ($timeout) {
    return {
      restrict: 'E',
      scope: {
        concepts: '=concepts',
        onSelect: '=onSelect',
        canRemove: '=removeable',
        showLabels: '=showLabels',
        language: '=language'
      },
      templateUrl: function (elem, attrs) {
        return attrs.templateUrl ? attrs.templateUrl : 'template/skos-list.html';
      },
      link: function link(scope, element, attr) {
        scope.$watch('concepts');
        scope.ID = Math.random().toString(36).slice(2);
        scope.removeConcept = function (index) {
          scope.concepts.splice(index, 1);
        };
        scope.focusConcept = function (index) {
          // TODO: remove depenency on jQuery
          var fc = angular.element('[list-id=' + scope.ID + '_' + index + ']');
          fc.focus();
        };
        scope.tabFocus = 0;
        scope.onClick = function (index) {
          scope.tabFocus = index;
          scope.onSelect(scope.concepts[index]);
        };
        scope.onFocus = function (index) {
          scope.tabFocus = index;
        };
        scope.onKeyDown = function ($event, first, last, index) {
          var key = $event.keyCode;
          var length = scope.concepts.length;
          if ([
              38,
              40,
              46,
              13
            ].indexOf(key) == -1 || length == 0)
            return;
          $event.preventDefault();
          // up
          if (key == 38) {
            scope.tabFocus = (scope.tabFocus + length - 1) % length;
            $timeout(function () {
              scope.focusConcept(scope.tabFocus);
            }, 0, false);  // down
          } else if (key == 40) {
            scope.tabFocus = (scope.tabFocus + 1) % length;
            $timeout(function () {
              scope.focusConcept(scope.tabFocus);
            }, 0, false);  // del
          } else if (key == 46 && scope.canRemove == true) {
            if (last) {
              scope.tabFocus--;
            }
            scope.removeConcept(index);
            $timeout(function () {
              scope.focusConcept(scope.tabFocus);
            }, 0, false);  // enter
          } else if (key == 13) {
            $event.preventDefault();
            scope.onSelect(scope.concepts[index]);
          }
        };
      }
    };
  }
]);
/**
 * @ngdoc directive
 * @name ng-skos.directive:skosTree
 * @restrict A
 * @description
 *
 * Displays a hierarchical view of a concept and its transitive narrowers.
 *
 * ## Customization
 *
 * The [default
 * template](https://github.com/gbv/ng-skos/blob/master/src/templates/skos-tree.html) 
 * can be changed with parameter `templateUrl`.
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
      scope: {
        tree: '=skosTree',
        language: '=language'
      },
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
 * @name ng-skos.service:SkosConceptProvider
 * @description
 * 
 * Get concepts via HTTP. 
 *
 * The server to be queried with this service is expected to return a JSON
 * object with one [concept](http://gbv.github.io/jskos/jskos.html#concepts)
 * The concept object may contain
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
 */
angular.module('ngSKOS').factory('SkosConceptProvider', [
  'SkosHTTPProvider',
  function (SkosHTTPProvider) {
    // inherit from SkosHTTPProvider
    var SkosConceptProvider = function (args) {
      SkosHTTPProvider.call(this, args);
    };
    SkosConceptProvider.prototype = new SkosHTTPProvider();
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
          }
          url = url.replace('{uri}', decodeURIComponent(concept.uri));
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
 * @name ng-skos.service:SkosHTTPProvider
 * @description
 * 
 * Utility service to facilitate HTTP requests. 
 *
 * This service implements use of URL templates to perform HTTP requests with 
 * optional transformation of JSON responses and error handling.
 *
 * The service is not related to JSKOS but used as utility in ng-skos.
 * 
 * ## Configuration
 * 
 * * **`url`**: URL template for requests
 * * **`jsonp`**: enable JSONP (true/false/0/1/name)
 * * **`transform`**: custom transformation function to map expected response format
 *
 * ## Methods
 *
 * * **`get([url])`**: perform a HTTP request
 *
 */
angular.module('ngSKOS').factory('SkosHTTPProvider', [
  '$http',
  '$q',
  function ($http, $q) {
    // constructor
    var SkosHTTPProvider = function (args) {
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
    SkosHTTPProvider.prototype = {
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
    return SkosHTTPProvider;
  }
]);
angular.module('ngSKOS').run([
  '$templateCache',
  function ($templateCache) {
    'use strict';
    $templateCache.put('template/skos-browser.html', '<div ng-if="scheme.suggest" style="margin:1em 0em"><input class="form-control" suggest-typeahead="scheme.suggest" typeahead-on-select="selectNotation($item.description)" ng-model="conceptLabel" placeholder="Search by terms (typeahead)" typeahead-loading="loading" typeahead-editable="false"> <i ng-show="loading" class="glyphicon glyphicon-refresh typeahead-loading"></i></div><div ng-if="selectNotation" class="search-top" style="overflow:hidden;margin-bottom:15px"><form ng-submit="selectNotation(notation)"><span style="float:left"><input class="form-control search-top-input" ng-model="notation" placeholder="Enter full notation"></span> <button type="submit" ng-disabled="!notation.length" class="search-top-button"><span class="glyphicon glyphicon-search"></span></button></form></div><div skos-concept="concept" skos-click="selectConcept" language="language"></div>');
    $templateCache.put('template/skos-concept-thesaurus.html', '<div class="skos-concept-thesaurus"><ul ng-if="ancestors.length" class="ancestors"><span ng-if="inScheme" class="classification">{{inScheme}}</span><li class="ancestor" ng-repeat="a in ancestors"><span skos-label="a.prefLabel" lang="{{language}}" ng-click="update(a);reload();"></span></li></ul><div class="top top-classic"><span ng-if="notation" class="notation">{{notation[0]}}</span> <b><span skos-label="concept.prefLabel" lang="{{language}}"></span></b><a ng-if="notation" class="uri" href="{{uri}}"><span style="vertical-align:-10%" class="glyphicon glyphicon-globe"></span></a></div><div ng-if="altLabel.length" class="skos-concept-altlabel"><ul><li ng-repeat="alt in altLabel"><span ng-if="$index < 5" style="display:inline"><span skos-label="alt"></span> <span style="margin-left:-4px;margin-right:3px" ng-if="$index < 4 && $index < altLabel.length-1">,</span></span></li></ul></div><div ng-if="broader.length" class="skos-concept-thesaurus-relation"><b>Broader Terms:</b><ul ng-repeat="b in broader"><li><span skos-label="b.prefLabel" lang="{{language}}" ng-click="click(b)"></li></ul></div><div ng-if="narrower.length" class="skos-concept-thesaurus-relation"><b>Narrower Terms:</b><ul ng-repeat="n in narrower"><li><span skos-label="n.prefLabel" lang="{{language}}" ng-click="click(n)"></li></ul></div><div ng-if="related.length" class="skos-concept-thesaurus-relation"><b>Related Terms:</b><ul ng-repeat="r in related"><li><span skos-label="r.prefLabel" lang="{{language}}" ng-click="click(r)"></li></ul></div></div>');
    $templateCache.put('template/skos-concept.html', '<div class="skos-concept"><div class="top top-alt"><span ng-if="notation.length" class="notation">{{notation[0]}}</span> <b><span ng-if="prefLabel" skos-label="concept.prefLabel" lang="{{language}}"></span></b> <a ng-if="uri && uri != notation" class="uri" href="{{uri}}"><span class="glyphicon glyphicon-globe"></span></a></div><div ng-if="altLabel.length" class="skos-concept-altlabel"><ul><li ng-repeat="alt in altLabel"><span ng-if="$index < 5" style="display:inline"><span skos-label="alt" lang="{{language}}"></span></span> <span style="margin-left:-4px;margin-right:3px" ng-if="$index < 4 && $index < altLabel.length-1">,</span></li></ul></div><div ng-if="broader.length || narrower.length || related.length" class="skos-concept-connected"><div ng-if="broader.length" class="skos-concept-relation skos-concept-relation-broader"><ul ng-repeat="c in broader"><li><span skos-label="c.prefLabel" lang="{{language}}" ng-click="click(c)" title="{{c.notation[0]}}"></span></li></ul></div><div ng-if="narrower.length" class="skos-concept-relation skos-concept-relation-narrower"><ul ng-repeat="c in narrower"><li><span skos-label="c.prefLabel" lang="{{language}}" ng-click="click(c)" title="{{c.notation[0]}}"></span></li></ul></div><div ng-if="related.length" class="skos-concept-relation skos-concept-relation-related"><ul ng-repeat="c in related"><li><span skos-label="c.prefLabel" lang="{{language}}" ng-click="click(c)" title="{{c.notation[0]}}"></span></li></ul></div></div><div ng-if="!isEmptyObject(note)" style="margin-top:10px"><div ng-repeat="n in note" lang="{{language}}" style="width:100%;padding:4px 6px;border:1px solid #ddd;margin-top:8px"><em><div skos-label="n"></div></em></div></div></div>');
    $templateCache.put('template/skos-list.html', '<ul ng-if="concepts.length" class="skos-simple-list"><li ng-repeat="c in concepts"><div class="set" tabindex="0" ng-keydown="onKeyDown($event, $first, $last, $index)" list-id="{{ID + \'_\' + $index}}" ng-focus="onFocus($index)"><span style="whitespace:nowrap" class="notation skos-list-notation" title="{{c.prefLabel}}" ng-click="onClick($index)">{{c.notation[0]}}</span> <span ng-if="showLabels" skos-label="c.prefLabel" lang="{{language}}" class="skos-list-label" ng-click="onClick($index)"></span><div style="display:inline-table;padding-left:3px"><a href="" ng-click="onSelect(c)" style="text-decoration:none"><span style="vertical-align:middle;top:0px" class="glyphicon glyphicon-info-sign" title="Select concept (ENTER)"></span></a> <a ng-if="canRemove" href="" ng-click="removeConcept($index)" style="text-decoration:none"><span style="vertical-align:middle;top:0px" class="glyphicon glyphicon-trash" title="Remove concept (DEL)"></span></a></div></div></li></ul>');
    $templateCache.put('template/skos-tree.html', '<div style="" class="skos-tree"><p class="set" ng-if="!tree.topConcepts"><span ng-if="tree.notation.length" class="notation" style="white-space:nowrap">{{tree.notation[0]}}</span> <span skos-label="tree.prefLabel" lang="{{language}}" style="padding-left:3px"></span></p><ul><li ng-repeat="n in tree.narrower ? tree.narrower : tree.topConcepts"><span skos-tree="n" language="language"></span></li></ul></div>');
  }
]);