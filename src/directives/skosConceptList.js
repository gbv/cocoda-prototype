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
            focus: '@focusOn'
        },
        templateUrl: function(elem, attrs) {
            return attrs.templateUrl ?
                   attrs.templateUrl : 'src/templates/skos-concept-list.html';
        },
        link: function link(scope, $scope, element, attrs) {
            scope.removeConcept = function(index) { 
                scope.concepts.splice(index, 1);
            };
            scope.tabFocus = 0;
            scope.$watch('concepts');
            scope.onKeyDown = function($event, first, last) {
                console.log($event.keyCode);
                var key = $event.keyCode;
                if(key == 38){
                    if(!first){
                        scope.tabFocus--;
                    }
                    console.log(scope.tabFocus);
                }
                if(key == 40){
                    if(!last){
                        scope.tabFocus++;
                    }
                    console.log(scope.tabFocus);
                }
            };
            scope.$watch('focus', function(value){
                console.log(value); // ?!
                if(value === "true"){
                }
            });
        },
    };
});
