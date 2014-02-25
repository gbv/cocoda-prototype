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
ngSKOS.directive('skosTree', function() {
    return {
        restrict: 'A',
        scope: {
            // ...
        },
        template: '...',
        link: function(scope, element, attrs) {
            // ...
        },
    };
});
