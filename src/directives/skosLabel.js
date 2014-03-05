/**
 * @ngdoc directive
 * @name ng-skos.directive:skosLabel
 * @restrict A
 * @description
 *
 * Displays the preferred label of a concept.
 * Changes on the preferred label are reflected in the display.
 *
 * @param {string} skos-label Assignable angular expression with 
 *      [concept](#/guide/concepts) data to bind to.
 * @param {string=} lang optional language. If not specified, an arbitrary
 *      preferred labels is selected.
 *
 * @example
 <example module="myApp">
  <file name="index.html">
    <div ng-controller="myController">
      <dl>
        <dt>en</dt>
        <dd><span skos-label="sampleConcept" lang="en"/></dd>
        <dt>de</dt>
        <dd><span skos-label="sampleConcept" lang="de"/></dd>
        <dt>fr</dt>
        <dd><span skos-label="sampleConcept" lang="fr"/></dd>
      </dl>
      <textarea json-text ng-model="sampleConcept" cols="40" rows="20" />
    </div>
  </file>
  <file name="script.js">
    angular.module('myApp',['ngSKOS','jsonText']);

    function myController($scope) {
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
        scope: { 
            concept: '=skosLabel',
            language: '@lang',
        },
        template: '{{concept.prefLabel[language]}}',
        link: function(scope, element, attrs) {
            var concept = scope.concept;
            if (!concept || !concept.prefLabel) return;

            // get any language unless required label available
            // TODO: remember original language and switch if available
            function updateLanguage(language) {
                if (!language || !concept.prefLabel[language]) {
                    for (language in concept.prefLabel) {
                        scope.language = language;
                        if (attrs.lang != language) {
                            attrs.$set('lang',language);
                        }
                        break;
                    }
                }
            }

            // update if lang attribute changed
            attrs.$observe('lang', function(val) {
                //console.log("observe: "+val);
                updateLanguage(val);  
            });
        },
    };
});
