angular.module('ngSKOS')
.directive('skosConceptList', function(){
    return {
        restrict: 'A',
        scope: {
            concepts: '=skosConceptList',
            onSelect: '=onSelect',
        },
        templateUrl: function(elem, attrs) {
            return attrs.templateUrl ?
                   attrs.templateUrl : 'template/skos-concept-list.html';
        },
        link: function link(scope, element, attr) {
            scope.removeConcept = function(index) { 
                scope.concepts.splice(index, 1);
            };
            scope.$watch('concepts');
        }
    };
});
