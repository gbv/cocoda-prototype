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

angular.module('ngSKOS')
.directive('skosConceptList', function(){
    return {
        restrict: 'A',
        scope: {
            concepts: '=skosConceptList',
            onSelect: '=onSelect',
        },
        templateUrl: function(elem, attrs) {
            return attrs.templateUrl ?
                   attrs.templateUrl : 'template/skos-concept-list.html';
        },
        link: function link(scope, element, attr) {
            scope.removeConcept = function(index) { 
                scope.concepts.splice(index, 1);
            };
            scope.$watch('concepts');
        }
    };
});
