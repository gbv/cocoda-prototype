'use strict';

describe('skos-concept directive', function() {
    beforeEach(module('ngSKOS'));

    it('...', function() { 
        inject(function($compile, $rootScope) {
            $rootScope.dummy = 1;
            var html = "<span>{{dummy}}</span>";
            var element = $compile(html)($rootScope);

            $rootScope.$digest(); // fire all watches
            expect(element.html()).toBe("1");

            $rootScope.c1 = { notation: 'abc' };
            html = "<div skos-concept concept='c1'>N:{{notation}}</div>";
            element = $compile(html)($rootScope);

            $rootScope.$digest(); // fire all watches
            expect(element.html()).toBe("N");

            // Modify $rootScope. ...
        }); 
    });
});
