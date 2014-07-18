/**
 * @ngdoc directive
 * @name ng-skos.directive:skosConceptMapping
 * @restrict A
 * @description
 *
 * This directive displays two lists of concepts for the purpose of mapping from one concept scheme to another. In addition, it provides tools to customize and export those mappings.
 *
 * ## Source code
 *
 * The most recent [source 
 * code](https://github.com/gbv/ng-skos/blob/master/src/directives/skosConceptMapping.js)
 * of this directive is available at GitHub.
 *
 * @param {string} mapping Mapping to display
 * @param {string} from Name of the current source scheme
 * @param {string} to Name of the current target scheme
 * @param {string} select function to export a single concept scheme
 * @param {string} saveLocation function to save the current mapping
 * @param {string} templateUrl URL of a template to display the mapping
 *
*/
angular.module('ngSKOS')
.directive('skosConceptMapping', function(){
    return{
        restrict: 'A',
        scope: {
            mapping: '=skosConceptMapping',
            from: '=mappingFrom',
            to: '=mappingTo',
            select: '=select',
            saveLocation: '=saveLocation'
           
        },
        templateUrl: function(elem, attrs) {
            return attrs.templateUrl ?
                   attrs.templateUrl : 'template/skos-concept-mapping.html';
        },
        link: function link(scope, element, attr) {
            scope.selectFrom = function(concept) {
                scope.select("origin",concept);
            };
            scope.selectTo = function(concept) {
                scope.select("target",concept);
            };
            scope.saveMapping = function() {
                scope.mapping.timestamp = new Date().toISOString().slice(0, 10);
                // TODO: Use own database to specify 'source'
                scope.mapping.source = function() {};
                // TODO: Save current mapping to 'saveLocation'
            };
            scope.$watch('mapping');
        }
    }
});