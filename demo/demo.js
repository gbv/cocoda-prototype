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
    $rootScope.searchSample = {
        // ...
    };
    $rootScope.ocurrencesSample = {
        search: { notation: "612.112" }, // concept
        database: { notation: "GVK" }, // database
        target: { notation: "RVK" }, // what to look for
        total: 42,
        hits: [
          [ { notation: "ABC 123" }, "22" ],
          [ { notation: "QR 13" }, "11" ],
          [ { notation: "QR 1355" }, "8" ],
          [ { notation: "XX 33" }, "1" ],
        ]
    };
    $rootScope.mappingSample = {
        from: [{ notation: "612.112" }],
        to: [{ notation: "ABC 123" }, { notation: "XX 33" }],
        type: "strong",
        timestamp: "2014-01-01"
    };
    $rootScope.treeSample = {
        // ...
    };
});
