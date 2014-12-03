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
.directive('skosConceptList', function($timeout){
    return {
        restrict: 'AE',
        scope: {
            concepts: '=skosConceptList',
            onSelect: '=onSelect',
            canRemove: '=removeable',
            showLabels: '=showLabels'
        },
        templateUrl: function(elem, attrs) {
            return attrs.templateUrl ?
                   attrs.templateUrl : 'src/templates/skos-concept-list.html';
        },
        link: function link(scope, element, attrs) {
            scope.removeConcept = function(index) { 
                scope.concepts.splice(index, 1);
            };
            scope.tabFocus = null;
            scope.$watch('concepts');
            scope.clicked = function(index){
                scope.tabFocus = index;
                scope.onSelect(scope.concepts[index]);
            };
            scope.focused = function(index){
                scope.tabFocus = index;
            };
            scope.onKeyDown = function($event, first, last, index) {
                var key = $event.keyCode;
                scope.tabFocus = index;
                if(key == 38){
                    $event.preventDefault();
                    if(!first){
                        scope.tabFocus--;
                    } else {
                        scope.tabFocus = scope.concepts.length - 1;
                    }
                    $timeout(function(){
                    var fc = angular.element("[list-id=" + scope.tabFocus + "]");
                    fc.focus();
                    },0,false);
                } else if(key == 40){
                    $event.preventDefault();
                    if(last){
                        scope.tabFocus = 0;
                    } else {
                        scope.tabFocus++;
                    }
                    $timeout(function(){
                        var fc = angular.element("[list-id=" + scope.tabFocus + "]");
                        fc.focus();
                    },0,false);
                } else if(key == 46){
                    $event.preventDefault();
                    if(last){
                        scope.tabFocus--;
                    }
                    scope.removeConcept(index);
                    $timeout(function(){
                        var fc = angular.element("[list-id=" + scope.tabFocus + "]");
                        fc.focus();
                    },0);
                } else if(key == 13){
                    $event.preventDefault();
                    scope.onSelect(scope.concepts[index]);
                }
            };
        },
    };
});
