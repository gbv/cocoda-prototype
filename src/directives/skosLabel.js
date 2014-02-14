/**
 * @ngdoc directive
 * @name ng-skos.directive:skosLabel
 * @restrict A
 * @description
 *
 * Displays the preferred label of a concept.
 * Changes on the preferred label are reflected in the display.
 *
 * @param {object} skos-label the concept
 *
 * @example
 * <example module="ngSKOS" animation="false">
 *   ...TODO...
 *   <span skos-label="concept" lang="en"/>
 * </example>
 */
ngSKOS.directive('skosLabel', function() {
    return {
        restrict: 'A',
        scope: { concept: '=skosLabel' },
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
