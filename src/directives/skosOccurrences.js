/**
 * @ngdoc directive
 * @name ng-skos.directive:skosOccurrences
 * @restrict A
 * @description
 *
 * ...
 *
 * @param {string} skos-occurrences ...
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
ngSKOS.directive('skosOccurrences', function() {
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
