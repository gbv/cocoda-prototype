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
 <example module="myApp">
  <file name="index.html">
    <div ng-controller="MainCtrl">
      {{sampleConcept}}
      <dl>
        <dt>en</dt>
        <dd><span skos-label="sampleConcept" lang="en"/></dd>
        <dt>de</dt>
        <dd><span skos-label="sampleConcept" lang="de"/></dd>
        <dt>fr</dt>
        <dd><span skos-label="sampleConcept" lang="fr"/></dd>
      </dl>
    </div>
  </file>
  <file name="script.js">
    angular.module('myApp',['ngSKOS']);

    function MainCtrl($scope) {
        $scope.sampleConcept = {
            prefLabel: { 
                en: "example",
                de: "Beispiel",
            },
        };
    }
  </file>
</example>
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
