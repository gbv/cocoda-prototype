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
            scope.$watch('concepts');
            scope.ID = Math.random().toString(36).slice(2);
            scope.removeConcept = function(index) { 
                scope.concepts.splice(index, 1);
            };
            scope.focusConcept = function(index) {
                // TODO: remove depenency on jQuery
                var fc = angular.element("[list-id=" + scope.ID + "_" + index + "]");
                fc.focus();
            };
            scope.tabFocus = 0;
            scope.onClick = function(index){
                scope.tabFocus = index;
                scope.onSelect(scope.concepts[index]);
            };
            scope.onFocus = function(index){
                scope.tabFocus = index;
                scope.hasFocus = true;
            };
            scope.onKeyDown = function($event, first, last, index) {
                var key = $event.keyCode;

                var length = scope.concepts.length;

                if ([38,40,46,13].indexOf(key) == -1 || length == 0) return;
                $event.preventDefault();

                if(key == 38){
                    scope.tabFocus = (scope.tabFocus + length - 1) % length;
                    $timeout(function(){ scope.focusConcept(scope.tabFocus) },0,false);
                } else if(key == 40){
                    scope.tabFocus = (scope.tabFocus + 1) % length;
                    $timeout(function(){ scope.focusConcept(scope.tabFocus) },0,false);
                } else if(key == 46){
                    if(last){
                        scope.tabFocus--;
                    }
                    scope.removeConcept(index);
                    $timeout(function(){ scope.focusConcept(scope.tabFocus) },0,false);
                } else if(key == 13){
                    $event.preventDefault();
                    scope.onSelect(scope.concepts[index]);
                }
            };
        }
    };
});
