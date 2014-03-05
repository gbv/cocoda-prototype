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
					occurrence:'=skosOccurrences',
        },
        templateUrl: function(element, attrs) {
            // TODO: use default if not specified
            return attrs.templateUrl;
        },
				link: function link(scope, element, attr, controller, transclude) {
					angular.forEach(
						['search','database','target','total','hits'],
						function(field) { 
              scope[field] = scope.occurrence[field];
							// TODO: add watcher/trigger
						}
					);
				}
    };
});
