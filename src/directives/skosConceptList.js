/**
 * @ngdoc directive
 * @name ngSKOS.directive:skosConceptList
 *
 * Element or attribute directive to show a list of concepts. The list is
 * created as <ul> child element to the directive element, possibly prepended
 * by a <span> with the list title.
 *
 * Options:
 * - concept (required, to be used as ng-repeat)
 * - title (optional)
 *
 * Element content is transcluded for each item.
 */
ngSKOS.directive('skosConceptList', function($parse) {
    // see http://stackoverflow.com/a/14426540/373710
    return {
        restrict: 'EA',
        transclude: 'element',
        replace: true,
        scope: true, //{ concepts: '=' },
        template: [
                '<ul>',
                '<li ng-transclude></li>',
                '</ul>'
            ].join(''),
/*            + "<div>"
//              "<div ng-if='concepts && concepts.length'>"
            + "<span ng-if='title'>{{title}}</span>"
            + "<ul>"+
            //+ "<li ng-repeat='concept in concepts' ng-transclude></li>"
            + "<li ng-transclude></li>"
            + "</ul></div>",
*/            
        compile: function(tElement, tAttrs, transclude) {
            //console.log(ul);

            var rpt = document.createAttribute('ng-repeat');
            rpt.nodeValue = tAttrs.concept;
            tElement[0].children[0].attributes.setNamedItem(rpt);

            return function (scope, element, attrs) {
                var rhs = attrs.concept.split(' in ')[1];
                scope.concepts = $parse(rhs)(scope);
                console.log(scope.concepts);
                scope.title = attrs.title;
            };
        },
    };
});
