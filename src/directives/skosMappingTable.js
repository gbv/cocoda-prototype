/**
 * @ngdoc directive
 * @name ng-skos.directive:skosMappingTable
 * @restrict A
 * @description
 *
 * This directive displays [mappings](#/guide/mappings) between concepts of
 * two concept schemes in a table format.
 *
 * ## Source code
 *
 * The most recent [source 
 * code](https://github.com/gbv/ng-skos/blob/master/src/directives/skosMappingTable.js)
 * of this directive is available at GitHub.
 *
 * @param {string} skos-mapping-table Mapping to display
 * @param {string} select-mapping function to handle mappings selected from within this template
 * @param {string} template-url URL of a template to display the mapping
 *
 * @example
 <example module="myApp">
  <file name="index.html">
    <div ng-controller="myController">
      <div skos-mapping-table="exampleMappings">
      </div>
    </div>
  </file>
  <file name="script.js">
    angular.module('myApp',['ngSKOS']);

    function myController($scope) {
        $scope.exampleMappings = {
            [{
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
            }]

        }
    }
  </file>
</example>
 */
angular.module('ngSKOS')
.directive('skosMappingTable', function() {
    return {
        restrict: 'A',
        scope: {
            mapping: '=skosMappingTable',
            select: '=selectMapping',
            lookup: '=lookupMapping'
        },
        templateUrl: function(elem, attrs) {
            return attrs.templateUrl ?
                   attrs.templateUrl : 'src/templates/skos-mapping-table.html';
        },
        link: function(scope, element, attr, controller, transclude) {
        },
        controller: function($scope) {
            $scope.predicate = '-timestamp';
        }
            // ...
    };
});
