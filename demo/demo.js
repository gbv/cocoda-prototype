var cocodaDemo = angular.module('cocodaDemo', ['ngSKOS','jsonText']);
cocodaDemo.run(function($rootScope) {
    $rootScope.sampleConcept = {
        ancestors: [ 
            { 'prefLabel': { en: 'root' } },
            { 'prefLabel': { en: 'child' } }
        ],
        notation: 'XY',
        prefLabel: { en: 'Sample&Concept', de: 'Beispiel<>Konzept' },
        note: { en: ['this is a note'] },
        narrower: [
            { prefLabel: { en: 'c1' } },
            { prefLabel: { en: 'c2' } },
        ]
    };
});
