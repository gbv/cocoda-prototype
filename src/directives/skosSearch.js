/**
 * @ngdoc directive
 * @name ng-skos.directive:skosSearch
 * @restrict A
 * @description
 *
 * ...
 *
 * @param {string} skos-search ...
 * @param {string} template-url URL of a template to display the search
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
angular.module('ngSKOS')
.directive('skosSearch', function() {
    return {
        restrict: 'A',
        scope: {
            // ...
        },
        templateUrl: function(elem, attrs) {
            return attrs.templateUrl ? 
                   attrs.templateUrl : 'template/skos-search.html';
        },
        link: function(scope, element, attrs) {
            // ...
        },
    };
});
