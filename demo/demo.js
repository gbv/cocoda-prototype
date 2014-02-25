var cocodaDemo = angular.module('cocodaDemo', ['ngSKOS','jsonText']);
cocodaDemo.run(function($rootScope) {
    $rootScope.sampleConcept = {
        ancestors: [ 
            { 'prefLabel': 
                { 
                    en: 'physics',
                    de: 'Physik'      
                }
            },
            { 'prefLabel': 
                { 
                    en: 'nuclear physics',
                    de: 'Kernphysik'                     
                } 
            }
        ],
        notation: 'UN',
        prefLabel: { 
            en: 'nuclear physics', 
            de: 'Kernphysik' 
        },
        note: { en: ['this is a note'] },
        narrower: [
            { 
                prefLabel: { 
                    en: 'general, textbooks',
                    de: 'Allgemeines, Lehrbücher'
                }
            },
            {
                prefLabel: {
                    en: 'compendiums, lectures, review books',
                    de: 'Kompendien, Vorlesungen, Repetitorien'
                }

            }
        ],
        broader: [
            { 
                prefLabel: { 
                    en: 'physics',
                    de: 'Physik'
                } 
            },
        ]
    };
});
