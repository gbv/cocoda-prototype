'use strict';

describe('skos-concept directive', function() {
    beforeEach(module('ngSKOS'));

    it('should do something', function() { 
        inject(function($compile,$rootScope) {
            var html = "<div skos-concept='c1'>{{notation}}: <i>{{prefLabel.en}}</i></div>";
     
            $rootScope.c1 = { 
                prefLabel: { en: 'chair' },
                notation: 'C',
            };

            var elem = $compile(html)($rootScope);

            $rootScope.$apply();
            var next = elem.next();
            
            expect(next.text()).toBe('C: chair');
        }); 
    });
});
