/**
 * @ngdoc directive
 * @name ng-skos.directive:skosMappingCollection
 * @restrict A
 * @description
 *
 * This directive displays [mappings](#/guide/mappings) between concepts of
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
.directive('skosMappingCollection', function() {
    return {
        restrict: 'A',
        scope: {
            mappings: '=skosMappingCollection',
            useMapping: '=useMapping'
        },
        templateUrl: function(elem, attrs) {
            return attrs.templateUrl ?
                   attrs.templateUrl : 'template/skos-mapping-collection.html';
        },
        link: function(scope, element, attr, controller, transclude) {
        }
            // ...
    };
});
