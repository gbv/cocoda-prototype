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
.directive('skosConceptList', function($timeout, $parse){
    return {
        restrict: 'A',
        scope: {
            concepts: '=skosConceptList',
            onSelect: '=onSelect',
        },
        templateUrl: function(elem, attrs) {
            return attrs.templateUrl ?
                   attrs.templateUrl : 'src/templates/skos-concept-list.html';
        },
        link: function link(scope, element, attrs) {
            scope.removeConcept = function(index) { 
                scope.concepts.splice(index, 1);
            };
            scope.tabFocus = 0;
            scope.$watch('concepts');
            scope.onKeyDown = function($event, first, last, index) {
                var key = $event.keyCode;
                scope.tabFocus = index;
                console.log(scope.tabFocus);
                if(key == 38){
                    $event.preventDefault();
                    if(!first){
                        scope.tabFocus--;
                        fc = angular.element("[list-id=" + scope.tabFocus + "]");
                        fc.focus();
                    }
                    console.log("up:" + scope.tabFocus);
                }
                if(key == 40){
                    $event.preventDefault();
                    if(!last){
                        scope.tabFocus++;
                        fc = angular.element("[list-id=" + scope.tabFocus + "]");
                        fc.focus();
                    }
                    console.log("down:" + scope.tabFocus);
                }
                if(key == 13){
                    
                }
                if(key == 82){
                    $event.preventDefault();
                    if(last){
                        scope.tabFocus--;
                    }
                    scope.removeConcept(index);
                    console.log("r:" + scope.tabFocus);
                    $timeout(function(){
                        fc = angular.element("[list-id=" + scope.tabFocus + "]");
                        fc.focus();
                    },50);
                }
            };
        },
    };
});
