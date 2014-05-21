/**
 * @ngdoc directive
 * @name ng-skos.directive:skosMapping
 * @restrict A
 * @description
 *
 * This directive displays a [mapping](#/guide/mappings) between concepts of
 * two concept schemes.
 *
 * ## Source code
 *
 * The most recent [source 
 * code](https://github.com/gbv/ng-skos/blob/master/src/directives/skosMapping.js)
 * of this directive is available at GitHub.
 *
 * @param {string} skos-mapping Mapping to display
 * @param {string} template-url URL of a template to display the mapping
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
.directive('skosMapping', function() {
    return {
        restrict: 'A',
        scope: {
            mapping: '=skosMapping',
        },
        templateUrl: function(elem, attrs) {
            return attrs.templateUrl ?
                   attrs.templateUrl : 'template/skos-mapping.html';
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
