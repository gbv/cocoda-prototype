/**
 * @ngdoc directive
 * @name ng-skos.directive:skosConcept
 * @restrict A
 * @scope
 * @description
 * 
 * Display a ng-skos [concept](#/guide/concepts).
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
 * @param {string} skos-concept Assignable angular expression with 
 *      [concept](#/guide/concepts) data to bind to.
 * @param {string} language Assignable angular expression with 
 *      preferred language to be used as bounded `language` variable. 
 * @param {string} template-url URL of a template to display the concept
 *
 * @example
 *
 */
angular.module('ngSKOS')
.directive('skosConcept', function() {
    return {
        restrict: 'AE',
        scope: { 
            concept: '=skosConcept',
            language: '=language',
            // TODO: uri/service to load from
        },
        templateUrl: function(elem, attrs) {
            return attrs.templateUrl ? 
                   attrs.templateUrl : 'template/skos-concept.html';
        },
        link: function link(scope, element, attr) {

            scope.update = function(concept) {
                if (concept) {
                    scope.concept = concept;
                }
                // TODO: choose prefLabel by language attribute (?)
                if (angular.isObject(scope.concept)) {
                    angular.forEach(['uri','inScheme','ancestors','prefLabel',
                        'altLabel','note','notation','narrower','broader','related'],
                        function(field) { 
                            scope[field] = scope.concept[field];
                            // TODO: add watcher/trigger
                        }
                    );
                }
            };

            // TODO: (re)load concept from server to get current details
            scope.reload = function() { };

            scope.update();

        }
    }
});
