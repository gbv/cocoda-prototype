'use strict';

describe('skos-concept directive', function() {
    beforeEach(module('ngSKOS'));

    it('should display a concept label',
        inject(function($compile,$rootScope) {
            var html = "<span skos-label=\"c1\"/>";
     
            $rootScope.c1 = { 
                prefLabel: { 
                    en: 'chair', 
                    de: 'Stuhl'
                }
            };

            var elem = $compile(html)($rootScope);

            $rootScope.$digest();
            expect(elem.html()).toBe('chair');

            // modify label
            $rootScope.c1.prefLabel.en = 'stool';
            $rootScope.$digest();
            expect(elem.html()).toBe('stool');

            // FIXME: trigger $observer
            //console.log("MOD");
            // modify language
            elem.attr('lang','de');
            //console.log(elem);
            //console.log(elem.scope().language);
            expect(elem.html()).toBe('Stuhl');
        })
    );
});
