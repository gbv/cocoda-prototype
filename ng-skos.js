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
var cocoda = angular.module('Cocoda', [
    'ngSKOS',
    'ui.bootstrap',
    'ngSuggest'
  ]);
/**
 * Konfiguration aller unterstützen Concept Schemes
 */
function knownSchemes(OpenSearchSuggestions, SkosConceptProvider, SkosConceptListProvider) {
  this.gnd = {
    name: 'GND',
    suggest: new OpenSearchSuggestions({
      url: 'http://api.lobid.org/subject?format=ids&name=',
      transform: function (response) {
        return {
          values: response.map(function (s) {
            return {
              label: s.label,
              uri: s.value
            };
          })
        };
      },
      jsonp: true
    }),
    getNarrower: new SkosConceptProvider({ url: 'http://lobid.org/subject?format=full&id={uri}' }),
    getConcept: new SkosConceptProvider({
      url: 'http://lobid.org/subject?format=full&id={uri}',
      transform: function (item) {
        var graph = item[1]['@graph'][0];
        var concept = {
            notation: [graph.gndIdentifier],
            uri: graph['@id'],
            prefLabel: { de: '' },
            broader: [],
            related: []
          };
        if (graph.preferredName) {
          concept.prefLabel.de = graph.preferredName;
        } else if (graph.preferredNameForThePlaceOrGeographicName) {
          concept.prefLabel.de = graph.preferredNameForThePlaceOrGeographicName;
        } else if (graph.preferredNameOfThePerson) {
          concept.prefLabel.de = graph.preferredNameOfThePerson;
        } else if (graph.preferredNameEntityForThePerson) {
          concept.prefLabel.de = graph.preferredNameEntityForThePerson;
        } else if (graph.preferredNameForTheConferenceOrEvent) {
          concept.prefLabel.de = graph.preferredNameForTheConferenceOrEvent;
        } else if (graph.preferredNameForTheCorporateBody) {
          concept.prefLabel.de = graph.preferredNameForTheCorporateBody;
        } else if (graph.preferredNameForTheFamily) {
          concept.prefLabel.de = graph.preferredNameForTheFamily;
        } else if (graph.preferredNameForThePerson) {
          concept.prefLabel.de = graph.preferredNameForThePerson;
        } else if (graph.preferredNameForTheSubjectHeading) {
          concept.prefLabel.de = graph.preferredNameForTheSubjectHeading;
        } else if (graph.preferredNameForTheWork) {
          concept.prefLabel.de = graph.preferredNameForTheWork;
        }
        if (graph.variantName) {
          concept.altLabel = graph.variantName;
        } else if (graph.variantNameForThePlaceOrGeographicName) {
          concept.altLabel = graph.variantNameForThePlaceOrGeographicName;
        } else if (graph.variantNameEntityForThePerson) {
          concept.altLabel = graph.variantNameEntityForThePerson;
        } else if (graph.variantNameForTheConferenceOrEvent) {
          concept.altLabel = graph.variantNameForTheConferenceOrEvent;
        } else if (graph.variantNameForTheCorporateBody) {
          concept.altLabel = graph.variantNameForTheCorporateBody;
        } else if (graph.variantNameForTheFamily) {
          concept.altLabel = graph.variantNameForTheFamily;
        } else if (graph.variantNameForThePerson) {
          concept.altLabel = graph.variantNameForThePerson;
        } else if (graph.variantNameForTheSubjectHeading) {
          concept.altLabel = graph.variantNameForTheSubjectHeading;
        } else if (graph.variantNameForTheWork) {
          concept.altLabel = graph.variantNameForTheWork;
        }
        if (angular.isString(concept.altLabel)) {
          concept.altLabel = [concept.altLabel];
        }
        var broader = [];
        if (graph.broaderTermGeneral) {
          broader = graph.broaderTermGeneral;
        }
        if (graph.broaderTermPartitive) {
          if (broader.length) {
            angular.forEach(graph.broaderTermPartitive, function (bterm) {
              broader.push(bterm);
            });
          } else {
            broader = graph.broaderTermPartitive;
          }
        }
        if (angular.isArray(broader)) {
          if (broader.length != 0) {
            angular.forEach(broader, function (bterm) {
              concept.broader.push({ uri: bterm });
            });
          }
        } else if (angular.isString(broader)) {
          concept.broader = [{ uri: broader }];
        }
        if (angular.isArray(graph.relatedTerm)) {
          angular.forEach(graph.relatedTerm, function (rterm) {
            concept.related.push({ uri: rterm });
          });
        } else if (angular.isString(graph.relatedTerm)) {
          concept.related = [{ uri: graph.relatedTerm }];
        }
        return concept;
      },
      jsonp: true
    })
  };
  var rvkTransform = function (nodes) {
    return {
      values: nodes.map(function (v) {
        return {
          label: v.benennung,
          notation: v.notation
        };
      })
    };
  };
  this.rvk = {
    name: 'RVK',
    topConcepts: new SkosConceptListProvider({
      url: 'http://rvk.uni-regensburg.de/api/json/children',
      jsonp: 'jsonp',
      transform: function (response) {
        return rvkTransform(response.node.children.node);
      }
    }),
    suggest: new OpenSearchSuggestions({
      url: 'http://rvk.uni-regensburg.de/api/json/nodes/{searchTerms}',
      jsonp: 'jsonp',
      transform: function (response) {
        return rvkTransform(response.node);
      },
      jsonp: 'jsonp'
    }),
    getConcept: new SkosConceptProvider({
      url: 'http://rvk.uni-regensburg.de/api/json/node/{notation}',
      transform: function (item) {
        var concept = {
            notation: [item.node.notation],
            uri: item.node.notation,
            prefLabel: { de: item.node.benennung },
            altLabel: '',
            hasChildren: false
          };
        if (angular.isArray(item.node.register)) {
          concept.altLabel = item.node.register;
        } else if (angular.isString(item.node.register)) {
          concept.altLabel = [item.node.register];
        }
        if (item.node.has_children == 'yes') {
          concept.hasChildren = true;
        }
        return concept;
      },
      jsonp: 'jsonp'
    }),
    getNarrower: new SkosConceptProvider({
      url: 'http://rvk.uni-regensburg.de/api/json/children/{notation}',
      transform: function (item) {
        var concept = {
            notation: [item.node.notation],
            uri: item.node.notation,
            prefLabel: { de: item.node.benennung },
            narrower: [],
            broader: []
          };
        if (!item.node.nochildren) {
          if (angular.isArray(item.node.children.node)) {
            angular.forEach(item.node.children.node, function (nterm) {
              concept.narrower.push({
                uri: nterm.notation,
                prefLabel: { de: nterm.benennung },
                notation: [nterm.notation]
              });
            });
          } else if (angular.isString(item.node.children.node)) {
            concept.narrower = [{
                uri: item.node.children.node.notation,
                prefLabel: { de: item.node.children.node.benennung },
                notation: [item.node.children.node.notation]
              }];
          }
        }
        return concept;
      },
      jsonp: 'jsonp'
    }),
    getBroader: new SkosConceptProvider({
      url: 'http://rvk.uni-regensburg.de/api/json/ancestors/{notation}',
      transform: function (item) {
        var concept = {
            notation: [item.node.notation],
            uri: item.node.notation,
            prefLabel: { de: item.node.benennung },
            broader: []
          };
        if (item.node.ancestor) {
          concept.broader.push({
            notation: [item.node.ancestor.node.notation],
            uri: item.node.ancestor.node.notation,
            prefLabel: { de: item.node.ancestor.node.benennung }
          });
        }
        return concept;
      },
      jsonp: 'jsonp'
    })
  };
  // TODO: this.ddc
  this.wikidata = {
    name: 'Wikidata',
    getConcept: new SkosConceptProvider({
      url: 'http://www.wikidata.org/w/api.php?action=wbgetentities&ids={notation}&props=info|labels|descriptions|aliases',
      jsonp: true,
      transform: function (item) {
        console.log(item);  // TODO
      }
    })
  };
}
;
cocoda.service('knownSchemes', [
  'OpenSearchSuggestions',
  'SkosConceptProvider',
  'SkosConceptListProvider',
  knownSchemes
]);
/**
 * Controller
 */
function myController($scope, $http, $q, SkosConceptProvider, OpenSearchSuggestions, knownSchemes) {
  // references to the http-calls
  $scope.schemes = knownSchemes;
  $scope.gndSubjectConcept = knownSchemes.gnd.getConcept;
  $scope.rvkSubjectConcept = knownSchemes.rvk.getConcept;
  $scope.rvkNarrowerConcepts = knownSchemes.rvk.getNarrower;
  $scope.rvkBroaderConcepts = knownSchemes.rvk.getBroader;
  // NG-SUGGEST & NAVBAR FUNCTIONALITY
  // possible profile scope
  $scope.loggedIn = false;
  // active source and target schemes
  $scope.activeView = {
    origin: 'GND',
    target: 'RVK'
  };
  // source scheme selection behavior
  $scope.setOrigin = function (scheme) {
    if (scheme == '') {
      $scope.activeView.origin = scheme;
      $scope.activeView.target = scheme;
      $scope.deleteAll();
      $scope.originConcept = '';
      $scope.originSubject = '';
      $scope.targetConcept = '';
      $scope.targetSubject = '';
    } else if (scheme != $scope.activeView.origin && scheme != '') {
      $scope.activeView.origin = scheme;
      $scope.originConcept = '';
      $scope.originSubject = '';
      $scope.deleteAll();
      $scope.changeTopOrigin(scheme);
    }
    if (scheme != '' && scheme == $scope.activeView.target) {
      $scope.activeView.origin = scheme;
      $scope.activeView.target = '';
      $scope.targetConcept = '';
      $scope.targetSubject = '';
      $scope.changeTopOrigin(scheme);
    }
  };
  // target scheme selection behavior
  $scope.setTarget = function (scheme) {
    if (scheme == '') {
      $scope.activeView.target = scheme;
      $scope.targetConcept = '';
      $scope.deleteAll();
    } else if (scheme != $scope.activeView.target && scheme != $scope.activeView.origin) {
      $scope.activeView.target = scheme;
      $scope.targetConcept = '';
      $scope.targetSubject = '';
      $scope.deleteAll();
      $scope.changeTopTarget(scheme);
    }
  };
  // decide which suggest function to call
  $scope.SuggestConcept = function (scheme) {
    scheme = scheme.toLowerCase();
    if ($scope.schemes[scheme]) {
      return $scope.schemes[scheme].suggest;
    }
  };
  /*
    $scope.safeApply = function(fn) { 
        var phase = this.$root.$$phase; 
        if(phase == '$apply' || phase == '$digest') { if(fn) fn(); } else { this.$apply(fn); } };
    */
  // TOP CONCEPTS
  if ($scope.activeView.origin == 'RVK') {
    knownSchemes.rvk.topConcepts.getConceptList().then(function (response) {
      $scope.topOriginConcept = response;
    });
  } else if ($scope.activeView.origin == 'DDC') {
  }
  if ($scope.activeView.target == 'RVK') {
    knownSchemes.rvk.topConcepts.getConceptList().then(function (response) {
      $scope.topTargetConcept = response;
    });
  } else if ($scope.activeView.target == 'DDC') {
  }
  $scope.changeTopOrigin = function (scheme) {
    if (scheme == 'RVK') {
      knownSchemes.rvk.topConcepts.getConceptList().then(function (response) {
        $scope.topOriginConcept = response;
      });
    } else if (scheme == 'DDC') {
    } else {
      $scope.topOriginConcept = '';
    }
  };
  $scope.changeTopTarget = function (scheme) {
    if (scheme == 'RVK') {
      knownSchemes.rvk.topConcepts.getConceptList().then(function (response) {
        $scope.topTargetConcept = response;
      });
    } else if (scheme == 'DDC') {
    } else {
      $scope.topTargetConcept = '';
    }
  };
  // show/hide top concepts
  $scope.showTopConcepts = {
    origin: true,
    target: true
  };
  // SKOS-MAPPING-COLLECTION/TABLE TO SKOS-CONCEPT-MAPPING
  // used in mapping templates to transfer existing mappings into active state
  $scope.insertMapping = function (mapping) {
    //complete mappings
    if (mapping.from) {
      if (mapping.from[0].inScheme.notation[0] == $scope.activeView.origin && mapping.to[0].inScheme.notation[0] == $scope.activeView.target) {
        $scope.currentMapping = angular.copy(mapping);  // $scope.currentMapping.timestamp = new Date().toISOString().slice(0, 10);
      }  // single target terms
    } else if (mapping.notation) {
      if (mapping.inScheme.notation[0] == $scope.activeView.target) {
        var dupes = false;
        angular.forEach($scope.currentMapping.to, function (value, key) {
          if (value.notation[0] == mapping.notation[0]) {
            dupes = true;
          }
        });
        if (dupes == 0) {
          $scope.currentMapping.to.push(mapping);
        }
      }
    }
  };
  // SKOS-OCCURRENCES TO SKOS-CONCEPT-MAPPING
  // scope for the created mapping
  $scope.currentMapping = {
    from: [],
    to: [],
    type: '',
    source: '',
    timestamp: ''
  };
  // SKOS-CONCEPT TO SKOS-CONCEPT-MAPPING FUNCTIONS
  // Choose origin mapping concept
  $scope.saveFrom = function (origin, item) {
    $scope.currentMapping.from[0] = {
      prefLabel: { de: item.prefLabel.de },
      inScheme: { notation: [origin] },
      notation: [item.notation[0] ? item.notation[0] : originConcept.uri],
      uri: item.uri
    };
  };
  // Add target mapping concept to list
  $scope.addTo = function (target, item) {
    $scope.currentMapping.to.push({
      prefLabel: { de: item.prefLabel.de },
      inScheme: { notation: [target] },
      notation: [item.notation[0]],
      uri: item.uri
    });
  };
  // check, if the chosen mapping concept is already in the list
  $scope.checkDuplicate = function () {
    var res = false;
    angular.forEach($scope.currentMapping.to, function (value, key) {
      var map = value;
      if ($scope.targetConcept.uri == map.uri) {
        res = true;
      }
    });
    return res;
  };
  // replace all target mappings with selected one
  $scope.replaceTo = function (target, item) {
    $scope.currentMapping.to = [];
    $scope.currentMapping.to.push({
      prefLabel: { de: item.prefLabel.de },
      inScheme: { notation: [target] },
      notation: [item.notation[0]],
      uri: item.uri
    });
  };
  // clear all origin and target mappings
  $scope.deleteAll = function () {
    $scope.currentMapping.to = [];
    $scope.currentMapping.from = [];
  };
  // SKOS-CONCEPT
  // used for buffering broader terms in RVK
  $scope.tempConcept = {
    notation: [],
    uri: '',
    prefLabel: { de: '' },
    broader: ''
  };
  // scope for notation inputs in topConcepts
  $scope.originNotation = {};
  $scope.targetNotation = {};
  // fill origin concept
  $scope.selectOriginSubject = function (item) {
    // check for selected concept scheme
    if ($scope.activeView.origin == 'GND') {
      // populate with basic data
      $scope.originConcept = {
        uri: item.uri,
        prefLabel: { de: item.label }
      };
      // update concept
      $scope.gndSubjectConcept.updateConcept($scope.originConcept).then(function () {
        $scope.gndSubjectConcept.updateConnected($scope.originConcept);
      });
      // when concept node is clicked
      $scope.clickOriginConcept = function (concept) {
        $scope.gndSubjectConcept.updateConcept($scope.originConcept = concept).then(function () {
          $scope.gndSubjectConcept.updateConnected($scope.originConcept);
        });
      };
    } else if ($scope.activeView.origin == 'RVK') {
      $scope.originConcept = {
        notation: [item.notation],
        uri: item.notation,
        prefLabel: { de: item.label }
      };
      // update concept
      $scope.rvkSubjectConcept.updateConcept($scope.originConcept).then(function () {
        // fill buffer concept, so originConcept won't be overwritten
        $scope.tempConcept = angular.copy($scope.originConcept);
        $scope.originSubject = $scope.originConcept.prefLabel.de;
        if ($scope.originConcept.hasChildren == true) {
          $scope.rvkNarrowerConcepts.updateConcept($scope.originConcept).then(function () {
            $scope.originConcept.altLabel = angular.copy($scope.tempConcept.altLabel);
            $scope.rvkBroaderConcepts.updateConcept($scope.tempConcept).then(function () {
              $scope.originConcept.broader = $scope.tempConcept.broader;
            });
          });
        } else {
          $scope.tempConcept = angular.copy($scope.originConcept);
          $scope.rvkBroaderConcepts.updateConcept($scope.originConcept).then(function () {
            $scope.originConcept.altLabel = $scope.tempConcept.altLabel;
          });
        }
      });
      // when concept node is clicked
      $scope.clickOriginConcept = function (concept) {
        $scope.rvkSubjectConcept.updateConcept($scope.originConcept = concept).then(function () {
          // fill buffer concept, so originConcept won't be overwritten
          $scope.tempConcept = angular.copy($scope.originConcept);
          if ($scope.originConcept.hasChildren == true) {
            $scope.rvkNarrowerConcepts.updateConcept($scope.originConcept).then(function () {
              $scope.originConcept.altLabel = angular.copy($scope.tempConcept.altLabel);
              $scope.rvkBroaderConcepts.updateConcept($scope.tempConcept).then(function () {
                $scope.originConcept.broader = $scope.tempConcept.broader;
              });
            });
          } else {
            $scope.tempConcept = angular.copy($scope.originConcept);
            $scope.rvkBroaderConcepts.updateConcept($scope.originConcept).then(function () {
              $scope.originConcept.altLabel = $scope.tempConcept.altLabel;
            });
          }
        });
      };
    }
  };
  // fill target concept
  $scope.selectTargetSubject = function (item) {
    // check for selected concept scheme
    if ($scope.activeView.target == 'GND') {
      // populate with basic data
      $scope.targetConcept = {
        uri: item.uri,
        prefLabel: { de: item.label }
      };
      // update concept
      $scope.gndSubjectConcept.updateConcept($scope.targetConcept).then(function () {
        $scope.gndSubjectConcept.updateConnected($scope.targetConcept);
      });
      // when concept node is clicked
      $scope.clickTargetConcept = function (concept) {
        $scope.gndSubjectConcept.updateConcept($scope.targetConcept = concept).then(function () {
          $scope.gndSubjectConcept.updateConnected($scope.targetConcept);
        });
      };
    } else if ($scope.activeView.target == 'RVK') {
      // populate with basic data
      $scope.targetConcept = {
        notation: [item.notation],
        uri: item.notation,
        prefLabel: { de: item.label }
      };
      // update concept
      $scope.rvkSubjectConcept.updateConcept($scope.targetConcept).then(function () {
        // fill buffer concept, so originConcept won't be overwritten
        $scope.tempConcept = angular.copy($scope.targetConcept);
        if ($scope.targetConcept.hasChildren == true) {
          $scope.rvkNarrowerConcepts.updateConcept($scope.targetConcept).then(function () {
            $scope.targetConcept.altLabel = angular.copy($scope.tempConcept.altLabel);
            $scope.rvkBroaderConcepts.updateConcept($scope.tempConcept).then(function () {
              $scope.targetConcept.broader = $scope.tempConcept.broader;
            });
          });
        } else {
          $scope.tempConcept = angular.copy($scope.targetConcept);
          $scope.rvkBroaderConcepts.updateConcept($scope.targetConcept).then(function () {
            $scope.targetConcept.altLabel = $scope.tempConcept.altLabel;
          });
        }
      });
      // when concept node is clicked
      $scope.clickTargetConcept = function (concept) {
        $scope.rvkSubjectConcept.updateConcept($scope.targetConcept = concept).then(function () {
          // fill buffer concept, so originConcept won't be overwritten
          $scope.tempConcept = angular.copy($scope.targetConcept);
          if ($scope.targetConcept.hasChildren == true) {
            $scope.rvkNarrowerConcepts.updateConcept($scope.targetConcept).then(function () {
              $scope.targetConcept.altLabel = angular.copy($scope.tempConcept.altLabel);
              $scope.rvkBroaderConcepts.updateConcept($scope.tempConcept).then(function () {
                $scope.targetConcept.broader = $scope.tempConcept.broader;
              });
            });
          } else {
            $scope.tempConcept = angular.copy($scope.targetConcept);
            $scope.rvkBroaderConcepts.updateConcept($scope.targetConcept).then(function () {
              $scope.targetConcept.altLabel = $scope.tempConcept.altLabel;
            });
          }
        });
      };
    }
  };
  // for filling the concept directly on selection
  $scope.reselectConcept = function (role, concept) {
    if (role == 'origin') {
      if (concept.prefLabel) {
        $scope.originConcept = {
          notation: concept.notation ? concept.notation : '',
          uri: concept.uri ? concept.uri : concept.notation,
          label: concept.prefLabel.de
        };
      } else if (concept.label) {
        $scope.originConcept = {
          notation: concept.notation ? concept.notation : '',
          uri: concept.uri ? concept.uri : concept.notation,
          label: concept.label
        };
      } else {
        $scope.originConcept = {
          notation: concept.notation ? concept.notation : '',
          uri: concept.uri ? concept.uri : concept.notation
        };
      }
      $scope.selectOriginSubject($scope.originConcept);
    } else if (role == 'target') {
      if (concept.prefLabel) {
        $scope.targetConcept = {
          notation: concept.notation ? concept.notation : '',
          uri: concept.uri ? concept.uri : concept.notation,
          label: concept.prefLabel.de
        };
      } else if (concept.label) {
        $scope.targetConcept = {
          notation: concept.notation ? concept.notation : '',
          uri: concept.uri ? concept.uri : concept.notation,
          label: concept.label
        };
      } else {
        $scope.targetConcept = {
          notation: concept.notation ? concept.notation : '',
          uri: concept.uri ? concept.uri : concept.notation
        };
      }
      $scope.selectTargetSubject($scope.targetConcept);
    }
  };
}
cocoda.run([
  '$rootScope',
  '$http',
  function ($rootScope, $http) {
    // load placeholder samples
    $rootScope.mappingSample = {};
    $http.get('http://localhost/data/mapping-1.json').success(function (data) {
      $rootScope.mappingSample = data;
    });
    $rootScope.mappingSampleGND = {};
    $http.get('http://localhost/data/mapping-2.json').success(function (data) {
      $rootScope.mappingSampleGND = data;
    });
    $rootScope.occurrencesSample = {};
    $http.get('http://localhost/data/occurrences-1.json').success(function (data) {
      $rootScope.occurrencesSample = data;
    });
  }
]);
cocoda.config([
  '$locationProvider',
  function ($locationProvider) {
    $locationProvider.html5Mode(true);
  }
]).controller('MainCtrl', [
  '$$rootScope',
  '$location',
  function ($$rootScope, $location) {
  }
]);
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
 * In addition the helper method `isEmptyObject` is provided to check whether an object
 * is empty.
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
      return attrs.templateUrl ? attrs.templateUrl : 'src/templates/skos-concept.html';
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
 * @param {string} canRemove support a `removeConcept` method to remove concepts
 * @param {string} showLabels chose, if concept labels should be shown as well as notations
 * @param {string} templateUrl URL of a template to display the concept list
 *
*/
angular.module('ngSKOS').directive('skosConceptList', [
  '$timeout',
  function ($timeout) {
    return {
      restrict: 'AE',
      scope: {
        concepts: '=skosConceptList',
        onSelect: '=onSelect',
        canRemove: '=removeable',
        showLabels: '=showLabels'
      },
      templateUrl: function (elem, attrs) {
        return attrs.templateUrl ? attrs.templateUrl : 'src/templates/skos-concept-list.html';
      },
      link: function link(scope, element, attrs) {
        scope.$watch('concepts');
        scope.ID = Math.random().toString(36).slice(2);
        scope.removeConcept = function (index) {
          scope.concepts.splice(index, 1);
        };
        scope.focusConcept = function (index) {
          // TODO: remove dependency on jQuery
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
      selectO: '=selectOriginConcept',
      selectT: '=selectTargetConcept',
      save: '=saveMapping'
    },
    templateUrl: function (elem, attrs) {
      return attrs.templateUrl ? attrs.templateUrl : 'src/templates/skos-concept-mapping.html';
    },
    link: function link(scope, element, attr) {
      scope.selectFrom = function (concept) {
        scope.selectO(concept);
      };
      scope.selectTo = function (concept) {
        scope.selectT(concept);
      };
      scope.saveMapping = function () {
        scope.mapping.timestamp = new Date().toISOString().slice(0, 10);
        // TODO: Use own database to specify 'source'
        scope.mapping.source = function () {
        };
        // TODO: Save current mapping to 'saveLocation'
        scope.saved = true;
      };
      scope.clearTargets = function () {
        scope.mapping.to = [];
      };
      scope.$watch('mapping.to', function () {
        scope.saved = false;
      }, true);
      scope.$watch('mapping.from', function () {
        scope.saved = false;
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
      useMapping: '=useMapping',
      lookUp: '=lookUpMapping'
    },
    templateUrl: function (elem, attrs) {
      return attrs.templateUrl ? attrs.templateUrl : 'src/templates/skos-mapping-collection.html';
    },
    link: function (scope, element, attr, controller, transclude) {
      scope.$watch('hidden');
    },
    controller: [
      '$scope',
      function ($scope) {
        $scope.status = {};
        angular.forEach($scope.mappings, function (key, value) {
          angular.forEach(key, function (key, value) {
            $scope.status[value] = { open: true };
          });
        });
      }
    ]
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
      select: '=selectMapping',
      lookup: '=lookupMapping'
    },
    templateUrl: function (elem, attrs) {
      return attrs.templateUrl ? attrs.templateUrl : 'src/templates/skos-mapping-table.html';
    },
    link: function (scope, element, attr, controller, transclude) {
    },
    controller: [
      '$scope',
      function ($scope) {
        $scope.predicate = '-timestamp';
      }  // ...
    ]
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
    scope: {
      occurrence: '=skosOccurrences',
      select: '=selectOccurrence',
      lookup: '=lookUpOccurrence'
    },
    templateUrl: function (elem, attrs) {
      return attrs.templateUrl ? attrs.templateUrl : 'src/templates/skos-occurrences.html';
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
    },
    controller: [
      '$scope',
      function ($scope) {
        $scope.status = { open: true };
      }
    ]
  };
});
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
    $templateCache.put('template/skos-concept-list.html', '<div style="font-size:1.5em"><ul ng-if="concepts.length" style="list-style-type:none;padding-left:0px"><li ng-repeat="c in concepts" style="max-width:320px;display:block"><div style="text-align:right;padding-left:3px;padding-right:3px" tabindex="0" ng-keydown="onKeyDown($event, $first, $last, $index)" list-id="{{ID + \'_\' + $index}}" ng-focus="onFocus($index)"><span class="notation" style="whitespace:nowrap" title="{{c.prefLabel.de}}" ng-click="onClick($index)">{{c.notation[0]}}</span> <span ng-if="showLabels" skos-label="c" lang="{{language}}" class="skos-list-label" ng-click="onClick($index)"></span><div style="display:inline-table"><a href="" ng-click="onSelect(c)" style="text-decoration:none" title="Select concept (ENTER)"><span style="vertical-align:middle;top:0px" class="glyphicon glyphicon-info-sign"></span></a> <a href="" ng-click="removeConcept($index)" style="text-decoration:none" title="Remove concept (DEL)"><span style="vertical-align:middle;top:0px" class="glyphicon glyphicon-trash"></span></a></div></div></li></ul></div>');
    $templateCache.put('template/skos-concept-mapping.html', '<div><div ng-if="!from.length && !to.length" style="margin-top:50px;margin-bottom:40px;text-align:center"><alert type="danger" style="display:inline-block">Please choose a concept scheme for mapping</alert></div><div ng-if="mapping.from.length && !from.length && !to.length" style="margin-top:10px;margin-bottom:5px;text-align:center"><alert type="danger">Please choose a term to work on</alert></div><div ng-if="from.length || mapping.to[0].notation.length" style="width:100%"><table style="width:95%;margin:0 auto;align:center"><thead class="simple-list" style="text-align:center"><tr><th style="width:400px"></th><th style="width:24px"></th><th style="width:400px;text-align:right"></th></tr></thead><tbody><tr><td><div class="tmpl-border mappingResults-from"><div ng-if="mapping.from.length" style="font-size:1.5em"><skos-list concepts="mapping.from" on-select="selectFrom" removeable="true" class="mapping-list"></skos-list></div><div ng-if="!mapping.from.length"><alert type="danger">Please select a source mapping term</alert></div></div></td><td><div style="margin:30px auto"><big><span class="glyphicon glyphicon-arrow-right"></span></big></div></td><td><div class="tmpl-border mappingResults-to" style="float:right"><div ng-if="mapping.to.length" style="font-size:1.5em"><skos-list concepts="mapping.to" on-select="selectTo" removeable="true" class="mapping-list mapping-target-list"></skos-list></div><div ng-if="!mapping.to.length && mapping.from.length"><alert style="margin-bottom:0px" type="danger">Add target mapping terms (<span style="color:#428bca" class="glyphicon glyphicon-plus"></span>)</alert></div></div></td></tr></tbody></table></div><div ng-if="from.length && to.length"><div style="width:95%;margin:0 auto"><div style="float:right;margin-top:10px"><button ng-if="save" ng-click="saveMapping()" ng-disabled="!mapping.from.length || !mapping.to.length" title="Save current mapping" accesskey="s"><span style="margin-right:5px">Save</span> <span class="glyphicon glyphicon-save"></span></button></div><div ng-if="mapping.to.length" style="float:right;margin-top:10px;margin-right:10px"><button ng-click="clearTargets()" title="Clear all target mappings" accesskey="c"><span style="margin-right:5px">Clear all</span> <span class="glyphicon glyphicon-remove"></span></button></div><div ng-if="mapping.timestamp && mapping.to.length" style="float:right;margin-top:13px;margin-right:15px">Created: <span>{{mapping.timestamp}}</span></div><div ng-if="saved" style="float:left;margin-top:5px"><alert type="success">Mapping Saved!</alert></div></div></div></div>');
    $templateCache.put('template/skos-concept-thesaurus.html', '<div class="skos-concept-thesaurus"><ul ng-if="ancestors.length" class="ancestors"><span ng-if="inScheme" class="classification">{{inScheme}}</span><li class="ancestor" ng-repeat="a in ancestors"><span skos-label="a" lang="{{language}}" ng-click="update(a);reload();"></span></li></ul><div class="top top-classic"><span ng-if="notation" class="notation">{{notation[0]}}</span> <b><span skos-label="concept" lang="{{language}}"></span></b><a ng-if="notation" class="uri" href="{{uri}}"><span style="vertical-align:-10%" class="glyphicon glyphicon-globe"></span></a></div><div ng-if="altLabel.length" class="skos-concept-altlabel"><ul><li ng-repeat="alt in altLabel"><span ng-if="$index < 5" style="display:inline">{{alt}}</span> <span style="margin-left:-4px;margin-right:3px" ng-if="$index < 4 && $index < altLabel.length-1">,</span></li></ul></div><div ng-if="broader.length" class="skos-concept-thesaurus-relation"><b>Broader Terms:</b><ul ng-repeat="b in broader"><li><span skos-label="b" lang="{{language}}" ng-click="click(b)"></li></ul></div><div ng-if="narrower.length" class="skos-concept-thesaurus-relation"><b>Narrower Terms:</b><ul ng-repeat="n in narrower"><li><span skos-label="n" lang="{{language}}" ng-click="click(n)"></li></ul></div><div ng-if="related.length" class="skos-concept-thesaurus-relation"><b>Related Terms:</b><ul ng-repeat="r in related"><li><span skos-label="r" lang="{{language}}" ng-click="click(r)"></li></ul></div></div>');
    $templateCache.put('template/skos-concept.html', '<div class="skos-concept"><div class="top top-alt"><span ng-if="notation.length" class="notation">{{notation[0]}}</span> <b><span ng-if="prefLabel" skos-label="concept" lang="{{language}}"></span></b> <a ng-if="uri && uri != notation" class="uri" href="{{uri}}" target="blank"><span class="glyphicon glyphicon-globe"></span></a></div><div ng-if="altLabel.length" class="skos-concept-altlabel"><ul><li ng-repeat="alt in altLabel"><span ng-if="$index < 5" style="display:inline">{{alt}}</span> <span style="margin-left:-4px;margin-right:3px" ng-if="$index < 4 && $index < altLabel.length-1">,</span></li></ul></div><div ng-if="broader.length || narrower.length || related.length" class="skos-concept-connected"><div ng-if="broader.length" class="skos-concept-relation skos-concept-relation-broader"><ul ng-repeat="c in broader"><li style="display:inline-table"><i class="notation connected-notation">{{c.notation[0]}}</i><span skos-label="c" lang="{{language}}" ng-click="click(c)" title="{{c.notation[0]}}" tabindex="0"></span></li></ul></div><div ng-if="narrower.length" class="skos-concept-relation skos-concept-relation-narrower"><ul ng-repeat="c in narrower" style="margin-left:1em"><li style="display:inline-table"><i class="notation connected-notation">{{c.notation[0]}}</i><span skos-label="c" lang="{{language}}" ng-click="click(c)" title="{{c.notation[0]}}" tabindex="0"></span></li></ul></div><div ng-if="related.length" class="skos-concept-relation skos-concept-relation-related"><ul ng-repeat="c in related"><li style="display:inline-table"><i class="notation connected-notation">{{c.notation[0]}}</i><span skos-label="c" lang="{{language}}" ng-click="click(c)" title="{{c.notation[0]}}" tabindex="0"></span></li></ul></div></div><div ng-if="!isEmptyObject(note)" style="margin-top:10px"><div ng-repeat="note in note.en" style="width:100%;padding:4px 6px;border:1px solid #ddd;margin-top:8px"><em>{{note}}</em></div></div></div>');
    $templateCache.put('template/skos-mapping-collection.html', '<accordion close-others="false"><div ng-repeat="s in mappings"><div ng-repeat="(skey, source) in s"><accordion-group is-open="status[skey].open" style="margin-bottom:6px"><accordion-heading><b>{{skey}}</b> <i class="pull-right glyphicon" ng-class="{\'glyphicon-chevron-down\': status[skey].open, \'glyphicon-chevron-right\': !status[skey].open}"></i></accordion-heading><div ng-repeat="f in source"><span ng-repeat="(fkey, from) in f"><span ng-repeat="t in from"><span ng-repeat="(tkey, to) in t"><div skos-mapping-table="to" select-mapping="useMapping" lookup-mapping="lookUp"></div></span></span></span></div></accordion-group></div></div></accordion>');
    $templateCache.put('template/skos-mapping-table.html', '<table style="white-space:nowrap" class="table table-hover table-condensed table-bordered"><thead><tr><th><span class="classification">{{mapping[0].from[0].inScheme.notation[0]}}</span></th><th><span class="classification">{{mapping[0].to[0].inScheme.notation[0]}}</span></th><th ng-if="type"><span style="margin-right:3px">Type</span> <a ng-click="predicate = \'type.value\';reverse = !reverse" href="" style="text-decoration:none;font-size:0.8em"><span class="glyphicon glyphicon-sort"></span></a></th><th><span style="margin-right:3px">Creator</span> <a ng-click="predicate = \'creator\';reverse = !reverse" href="" style="text-decoration:none;font-size:0.8em"><span class="glyphicon glyphicon-sort"></span></a></th><th style="width:100px"><span style="margin-right:3px">Date</span> <a ng-click="predicate = \'timestamp\';reverse = !reverse" href="" style="text-decoration:none;font-size:0.8em"><span class="glyphicon glyphicon-sort"></span></a></th><th ng-if="select"></th></tr></thead><tbody><tr ng-repeat="m in mapping | orderBy:predicate:reverse"><td><ul class="simple-list" style="margin-bottom:0px"><li ng-repeat="f in m.from"><span class="notation" style="max-width:85px;white-space:nowrap" popover="{{f.prefLabel.de}}" popover-trigger="mouseenter">{{f.notation[0]}}</span></li></ul></td><td><ul class="simple-list" style="margin-bottom:0px;margin-top:2px"><li ng-repeat="t in m.to"><div class="skos-mapping-target" style=""><span class="notation" popover="{{t.prefLabel.de}}" popover-trigger="mouseenter">{{t.notation[0]}}</span> <a ng-if="lookup" title="Look up term" style="font-size:0.85em;cursor:pointer"><span ng-click="lookup(t)"><span style="top:2px;vertical-align:top" class="glyphicon glyphicon-info-sign"></span></span></a> <a ng-if="select" title="Add mapping term" style="font-size:0.85em;cursor:pointer"><span ng-click="select(t)"><span style="vertical-align:top" class="glyphicon glyphicon-plus"></span></span></a></div></li></ul></td><td ng-if="type">{{m.type.prefLabel.en}}</td><td class="skos-mapping-cell" style="vertical-align:middle"><span>{{m.creator}}</span></td><td class="skos-mapping-cell" style="vertical-align:middle;max-width:100px"><span>{{m.timestamp}}</span></td><td ng-if="select" style="vertical-align:middle" class="skos-mapping-cell"><a style="cursor:pointer" ng-click="select(m)" title="Select mapping"><span class="glyphicon glyphicon-open"></span></a></td></tr></tbody></table>');
    $templateCache.put('template/skos-mapping.html', '<div class="skos-mapping"><table style="width:100%"><thead><tr style="width:100%"><th style="width:45%"><span class="classification">{{mapping[0].from[0].inScheme.notation[0]}}</span></th><th style="width:10%"></th><th style="width:45%"><span class="classification">{{mapping[0].to[0].inScheme.notation[0]}}</span></th></tr></thead></table><div ng-repeat="m in mapping"><table style="width:100%"><thead><tr style="width:100%"><th style="width:45%"></th><th style="width:10%"></th><th style="width:45%"></th></tr></thead><tbody class="mappingResults"><tr style="vertical-align:top"><td><div class="mappingResults-from"><ul><li ng-repeat="from in m.from"><span class="notation" popover="{{from.prefLabel.en}}" popover-trigger="mouseenter">{{from.notation[0]}}</span></li></ul></div></td><td><div class="mappingResults-icon"><big><span ng-if="m.from.length || m.to.length" class="glyphicon glyphicon-arrow-right"></span></big></div></td><td><div class="mappingResults-to"><ul><li ng-repeat="target in m.to"><span class="notation" popover="{{target.prefLabel.en}}" popover-trigger="mouseenter">{{target.notation[0]}}</span></li></ul></div></td></tr></tbody></table><div class="mappingFoot"><ul ng-if="m.from.length"><li><span><b>Type:</b></span> <span>{{m.type}}</span> <span><b>Date added:</b></span> <span>{{m.timestamp}}</span> <span><b>Database:</b></span> <span>{{m.source}}</span> <button style="float:right" ng-click="useMapping(m)" ng-if="useMapping">Use</button></li></ul></div><div ng-if="$index < mapping.length-1" style="border-bottom:1px solid black;margin-bottom:5px"></div></div></div>');
    $templateCache.put('template/skos-occurrences.html', '<accordion><accordion-group is-open="status.open"><accordion-heading><b>Catalog Occurrences</b><i class="pull-right glyphicon" ng-class="{\'glyphicon-chevron-down\': status.open, \'glyphicon-chevron-right\': !status.open}"></i></accordion-heading><div class="skos-occurrences"><div class="skos-occurrences occ-details"><table><tr><td>Used notation:</td><td><span ng-if="search.length" class="notation" popover="{{search[0].prefLabel.de}}" popover-trigger="mouseenter">{{search[0].notation[0]}}</span></td></tr><tr><td>Used database:</td><td><span ng-if="search.length" class="dbase">{{database.notation[0]}}</span></td></tr><tr ng-if="search.length"><td>Results (total) for <span ng-if="search.length" class="notation" popover="{{search[0].prefLabel.de}}" popover-trigger="mouseenter">{{search[0].notation[0]}}</span>:</td><td>{{total}}</td></tr></table></div><div class="skos-occurrences occ-results">Corresponding notations in <span ng-if="search.length" class="classification">{{target.notation[0]}}</span>:<table ng-if="search.length" class="table table-hover table-condensed table-bordered"><thead><tr><th>Notation</th><th>Hits</th><th>% of total</th></tr></thead><tbody><tr ng-repeat="not in hits"><td><div style="width:100%;clear:both"><span ng-if="not.length" class="notation" popover="{{not[0].prefLabel.de}}" popover-trigger="mouseenter">{{not[0].notation[0]}}</span> <a ng-if="lookup" title="Look up term" style="font-size:0.85em;cursor:pointer"><span ng-click="lookup(not[0])" class="skos-link-icon" title="Look up notation"><span class="glyphicon glyphicon-info-sign"></span></span></a> <a ng-if="select" title="Add mapping term" style="font-size:0.85em;cursor:pointer"><span ng-click="select(not[0])" class="skos-link-icon" title="Select concept"><span class="glyphicon glyphicon-plus"></span></span></a></div></td><td>{{not[1]}}</td><td>{{not[1]/total*100 | number:1}} %</td></tr></tbody></table></div></div></accordion-group></accordion>');
  }
]);