angular.module('ngSKOS')
.directive('skosConceptMapping', function(){
    return{
        restrict: 'A',
        scope: {
            mapping: '=skosConceptMapping',
            from: '=mappingFrom',
            to: '=mappingTo',
            remove: '=remove',
            select: '=select'
           
        },
        templateUrl: function(elem, attrs) {
            return attrs.templateUrl ?
                   attrs.templateUrl : 'template/skos-concept-mapping.html';
        },
        link: function link(scope, element, attr) {

            scope.$watch('mapping');
        }
    }
});