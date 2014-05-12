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
            tree:'=skosTree',
        },
        templateUrl: function(element, attrs) {
            // TODO: use default if not specified
            return attrs.templateUrl ?
                attrs.templateUrl : 'templates/tree.html';
        },
        link: function(scope, element, attr, controller, transclude) {
            angular.forEach(
                ['uri','prefLabel','notation','narrower'],
                function(field) { 
                    scope[field] = scope.tree[field];
                        // TODO: add watcher/trigger
                }
          );
            // ...
        },
    };
});
