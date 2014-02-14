'use strict';

describe('skos-concept directive', function() {
    beforeEach(module('ngSKOS'));

    it('should display a concept label',
        inject(function($compile,$rootScope) {
            var html = "<span skos-label=\"c1\"/>";
     
            $rootScope.c1 = { 
                prefLabel: { 
                    en: 'chair' 
                }
            };

            var elem = angular.element(html);
            $compile(elem)($rootScope);
            $rootScope.$digest();
     
            expect(elem.html()).toBe('chair');

            // modify label
            $rootScope.c1.prefLabel.en = 'stool';
            $rootScope.$digest();
            expect(elem.html()).toBe('stool');

        })
    );
});
