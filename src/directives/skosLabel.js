/**
 * @ngdoc directive
 * @name ngSKOS.directive:skosLabel
 *
 * Attribute directive to show the preferred label of a concept.
 *
 * Changes on the preferred label are reflected in the display.
 */
ngSKOS.directive('skosLabel', function() {
    return {
        restrict: 'A',
        scope: { concept: '=' },
        template: '{{concept.prefLabel[lang]}}',
        link: function(scope, element, attrs) {
            var concept = scope.concept;
            if (!concept || !concept.prefLabel) return;
            var lang = attrs.lang;

            // get any language unless required label available
            // TODO: remember original language and observer attrs.lang
            if (!lang || !concept.prefLabel[lang]) {
                for (lang in concept.prefLabel) {
                    element.attr('lang',lang);
                    break;
                }
            }

            scope.lang = lang;
        },
    };
});
