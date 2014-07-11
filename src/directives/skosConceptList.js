angular.module('ngSKOS')
.directive('skosConceptList', function(){
    return {
        restrict: 'A',
        scope: {
            concepts: '=skosConceptList',
            role: '@currentRole',
            del: '=onDelete',
            sel: '=onSelect',
        },
        templateUrl: function(elem, attrs) {
            return attrs.templateUrl ?
                   attrs.templateUrl : 'template/skos-concept-list.html';
        },
        link: function link(scope, element, attr) {
            scope.$watch('concepts');
        }
    };
});