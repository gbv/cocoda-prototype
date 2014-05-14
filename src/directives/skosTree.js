/**
 * @ngdoc directive
 * @name ng-skos.directive:skosTree
 * @restrict A
 * @description
 *
 * ...
 *
 * @param {string} skos-tree ...
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
ngSKOS.directive('skosTree', function($compile) {
    return {
        restrict: 'A',
        transclude: true,
        scope: {
            tree:'=skosTree',
        },
        templateUrl: function(element, attrs) {
            // TODO: use default if not specified
            return attrs.templateUrl ?
            attrs.templateUrl : 'templates/tree.html';
        },
        compile: function(tElement, tAttr, transclude) {
            var contents = tElement.contents().remove();
            console.log(contents);
            var compiledContents;
            return function(scope, iElement, iAttr) {
                if(!compiledContents) {
                    compiledContents = $compile(contents, transclude);
                }
                compiledContents(scope, function(clone, scope) {
                         iElement.append(clone); 
                });
            };
        }
    };
});
