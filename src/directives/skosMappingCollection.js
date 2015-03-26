/**
 * @ngdoc directive
 * @name ng-skos.directive:skosMappingCollection
 * @restrict A
 * @description
 *
 * This directive displays mapping tables between [concepts](#/guide/concepts) of
 * two concept schemes.
 *
 * ## Source code
 *
 * The most recent [source 
 * code](https://github.com/gbv/ng-skos/blob/master/src/directives/skosMappingCollection.js)
 * of this directive is available at GitHub.
 *
 * @param {string} skos-mapping-collection Mapping to display
 * @param {string} use-mapping function to handle mappings selected from within this template
 * @param {string} template-url URL of a template to display the mapping
 *
 * @example
 <example module="myApp">
  <file name="index.html">
    <div ng-controller="myController">
      <div skos-mapping-collection="exampleMappings">
      </div>
    </div>
  </file>
  <file name="script.js">
    angular.module('myApp',['ngSKOS']);

    function myController($scope) {
        $scope.exampleMappings = {
            {
                from: [{
                    notation: [ '12345' ],
                    prefLabel: { en: 'originLabel1' },
                    inScheme: { notation: ['origin'] }
                }],
                to: [{
                    notation: [ 'ABC' ],
                    prefLabel: { en: 'targetLabel1' },
                    inSchemen: { notation: ['target'] }
                }
                type: 'strong',
                timestamp: '2014-01-01',
                source: 'source'
            },
            {
                from: [{
                    notation: [ '98765' ],
                    prefLabel: { en: 'originLabel2' },
                    inScheme: { notation: ['origin'] }
                }],
                to: [{
                    notation: [ 'DEF' ],
                    prefLabel: { en: 'targetLabel2' },
                    inSchemen: { notation: ['target'] }
                }
                type: 'medium',
                timestamp: '2010-05-05',
                source: 'source'
            }
        }
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
            useMapping: '=useMapping',
            lookUp: '=lookUpMapping',
            language: '=language',
            schemes: '=activeSchemes'
        },
        templateUrl: function(elem, attrs) {
            return attrs.templateUrl ?
                   attrs.templateUrl : 'src/templates/skos-mapping-collection.html';
        },
        link: function(scope, element, attr, controller, transclude) {
            scope.$watch('language');
        },
        controller: function($scope){
            $scope.status = { open: true};
        }
    };
});
