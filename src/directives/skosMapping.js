/**
 * @ngdoc directive
 * @name ng-skos.directive:skosMapping
 * @restrict A
 * @description
 *
 * ...
 *
 * @param {string} skos-mapping ...
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
ngSKOS.directive('skosMapping', function() {
    return {
        restrict: 'A',
        scope: {
            mapping: '=skosMapping',
        },
        templateUrl: function(element, attrs) {
            // TODO: use default if not specified
            return attrs.templateUrl ?
            attrs.templateUrl : 'templates/mapping.html';
        },
        link: function(scope, element, attr, controller, transclude) {

                angular.forEach(
                    ['from','to','type','timestamp'],
                    function(field) { 
                        scope[field] = scope.mapping[field];
                        // TODO: add watcher/trigger
                    }
                );
            // ...
        },
    };
});
