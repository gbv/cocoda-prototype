var cocodaDemo = angular.module('cocodaDemo', ['Cocoda']);
cocodaDemo.run(function($rootScope) {
    $rootScope.sampleConcept = {
        ancestors: [ 
            { 'prefLabel': { en: 'root' } },
            { 'prefLabel': { en: 'child' } }
        ],
        notation: 'XY',
        prefLabel: { en: 'SampleConcept' },
        note: { en: ['this is a note'] },
    };
});
