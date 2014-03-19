'use strict';

describe('skos-label directive', function() {
    beforeEach(module('ngSKOS'));

    var scope, element;

    // for each test create a new scope with a sample concept
    beforeEach(inject(function($rootScope, $compile) {
        scope = $rootScope.$new();
        scope.myConcept = { 
            prefLabel: { 
                en: 'chair', 
                de: 'Stuhl'
            }
        };
        scope.myLang = 'en';
    }));

    function compileDirective(template) {
        inject(function($compile) {
            element = $compile(template)(scope);
        });
        scope.$digest();
    };

    it('should always display a concept label',function(){
        compileDirective('<span skos-label="myConcept"/>');
        expect(element.html()).toBeTruthy();
    });

    it('should display a label of requested language',function(){
        compileDirective('<span skos-label="myConcept" lang="en"/>');
        expect(element.html()).toBe('chair')
    });

    it('should reflect concept label changes',function(){
        compileDirective('<span skos-label="myConcept" lang="en"/>');

        scope.myConcept.prefLabel.en = 'stool';
        scope.$digest();
        expect(element.html()).toBe('stool');

        delete scope.myConcept.prefLabel.en;
        scope.$digest();
        expect(element.html()).toBe('Stuhl');

        scope.myConcept.prefLabel.en = 'chair';
        scope.$digest();
        expect(element.html()).toBe('chair');
    });

/*
    it('should reflect lang attribute changes',function(){
        compileDirective('<span skos-label="myConcept" lang="en"/>');
        element.attr('lang','de');
        scope.$digest();
        expect(element.html()).toBe('Stuhl');
    });
*/

    it('should reflect lang attribute changes',function(){
        compileDirective('<span skos-label="myConcept" lang="{{myLang}}"/>');
        scope.myLang = "de";
        scope.$digest();
        expect(element.html()).toBe('Stuhl');
    });

});
