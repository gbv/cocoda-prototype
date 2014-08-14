/**
 * @ngdoc directive
 * @name ng-skos.directive:skosOccurrences
 * @restrict A
 * @description
 *
 * ...
 *
 * @param {string} skos-occurrences ...
 * @param {string} template-url URL of a template to display the occurrences
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
.directive('skosOccurrences', function() {
    return {
        restrict: 'A',
        scope: {
            occurrence:'=skosOccurrences',
            select:'=selectOccurrence',
        },
        templateUrl: function(elem, attrs) {
            return attrs.templateUrl ? 
                   attrs.templateUrl : 'src/templates/skos-occurrences.html';
        },
        link: function link(scope, element, attr, controller, transclude) {
            angular.forEach(
                ['search','database','target','total','hits'],
                function(field) { 
                    scope[field] = scope.occurrence[field];
                    // TODO: add watcher/trigger
                }
            );
        },
        controller: function($scope){
            $scope.status = {open: true};
        }
    };
});
