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
angular.module('ngSKOS')
.directive('skosConcept', function() {
    return {
        restrict: 'AE',
        scope: { 
            concept: '=skosConcept',
            language: '=language',
            // TODO: simplify use by providing a SkosConceptProvider and properties
        },
        templateUrl: function(elem, attrs) {
            return attrs.templateUrl ? 
                   attrs.templateUrl : 'template/skos-concept.html';
        },
        link: function link(scope, element, attr) {
            scope.$watch('concept',function(concept) {
                angular.forEach(['uri','inScheme','ancestors','prefLabel',
                    'altLabel','note','notation','narrower','broader','related'],
                    function(field) { scope[field] = concept[field] }
                );
            },true);
        }
    }
});
