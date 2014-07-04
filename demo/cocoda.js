var cocoda = angular.module('Cocoda', ['ngSKOS','ui.bootstrap','ngSuggest']);

function myController($scope, $http, $q, SkosConceptProvider, OpenSearchSuggestions){

    // Suggestions API via lobid.org
    $scope.gndSubjectSuggest = new OpenSearchSuggestions({
        url: "http://api.lobid.org/subject?format=ids&name=",
        transform: function(response) {
            return {
                values: response.map(function(s) {
                    return { label: s.label, uri: s.value }
                }),
            };
        },
        jsonp: true
    });
    
    var rvkProvider = new SkosConceptProvider({
        url:'data/rvk/{notation}.json',
        jsonp: false
    });

    /*
    $scope.safeApply = function(fn) { 
        var phase = this.$root.$$phase; 
        if(phase == '$apply' || phase == '$digest') { if(fn) fn(); } else { this.$apply(fn); } };
    */

    $scope.sampleConcept = { notation: ['UN'] };
    rvkProvider.updateConcept($scope.sampleConcept);
    
    $scope.activeView = {
        origin: '',
        target: ''
    };
    
    $scope.saveTerm = function(origin,target,item){
        $scope.currentTerm = {
            origin: origin,
            target: target,
            label: item.prefLabel.de,
            notation: item.notation[0]
        };
    };
    
    // Concept via lobid.org
    $scope.gndSubjectConcept = new SkosConceptProvider({
        url: "http://lobid.org/subject?format=full&id={uri}",
        transform: function(item) {
            var graph = item[1]['@graph'][0];
            
            var concept = {
                notation: [ graph.gndIdentifier ],
                prefLabel: { de: graph.preferredName },
                altLabel: "",
                uri: graph['@id'],
                broader: [],
                related: [],
            };
            if(angular.isArray(graph.variantName)){
                concept.altLabel = graph.variantName;
            }else if(angular.isString(graph.variantName)){
                concept.altLabel = [graph.variantName];
            }
                
            if(angular.isArray(graph.broaderTermGeneral)){
                angular.forEach(graph.broaderTermGeneral, function(bterm) {
                    concept.broader.push({uri: bterm });
                });
            } else if(angular.isString(graph.broaderTermGeneral)){
                concept.broader = [{uri: graph.broaderTermGeneral}];
            }
            if(angular.isArray(graph.relatedTerm)){
                angular.forEach(graph.relatedTerm, function(rterm) {
                    concept.related.push({uri: rterm });
                });
            } else if(angular.isString(graph.relatedTerm)){
                concept.related = [{uri: graph.relatedTerm}];
            }
            return concept;
        },
        jsonp: true
    });
    // when item is selected
    $scope.selectGndSubject = function(item) {

        // populate with basic data
        $scope.subjectConcept = {
            uri: item.uri,
            prefLabel: {
                en: item.label
            }
        };

        // update
        $scope.gndSubjectConcept.updateConcept($scope.subjectConcept).then(function() {
            $scope.gndSubjectConcept.updateConnected($scope.subjectConcept)
        });

        // click
        $scope.clickConcept = function(concept) {
            console.log(concept);
            $scope.gndSubjectConcept.updateConcept( $scope.subjectConcept = concept ).then(
                function() {
                    $scope.gndSubject = concept.prefLabel.de; // TODO: nur wenn vorhanden
                    $scope.gndSubjectConcept.updateConnected($scope.subjectConcept)
                }
            );
        };
    };
    // for filling the concept directly
    $scope.selectSampleConcept = function(label, uri){
        
        $scope.subjectConcept = {
            uri: uri,
            prefLabel: {
                en: label
            }
        }
        $scope.gndSubjectConcept.updateConcept($scope.subjectConcept).then(function() {
            $scope.gndSubjectConcept.updateConnected($scope.subjectConcept)
        });
    }
}
cocoda.run(function($rootScope,$http) {

    $rootScope.mappingSample = {};
    $http.get('data/mapping-1.json').success(function(data){
        $rootScope.mappingSample = data;
    });

    $rootScope.occurrencesSample = {};
    $http.get('data/occurrences-1.json').success(function(data){
        $rootScope.occurrencesSample = data;
    });

    $rootScope.treeSample = {};
    $http.get('data/tree-1.json').success(function(data){
        $rootScope.treeSample = data;
    });

    $rootScope.searchSample = {
        // TODO
    };

});
cocoda.config(function($locationProvider) {
    $locationProvider.html5Mode(true);
}).controller('MainCtrl', function ($$rootScope, $location) { });
