var wikidataApp = angular.module('WikidataApp', ['ngSKOS','ui.bootstrap','ngSuggest']);

function schemes(OpenSearchSuggestions, SkosConceptSource, SkosConceptListSource) {
    this.wikidata = wikidataScheme(OpenSearchSuggestions, SkosConceptSource, SkosConceptListSource);
}

wikidataApp.service('schemes', 
        ["OpenSearchSuggestions","SkosConceptSource","SkosConceptListSource",
        schemes]);

function myController($scope, $http, $q, SkosConceptSource, OpenSearchSuggestions, schemes){
    $scope.schemes = schemes;

    $scope.suggestConcept = $scope.schemes.wikidata.suggest;
    $scope.conceptProvider = $scope.schemes.wikidata.getConcept;

    $scope.selectConceptByNotation = function(notation) {
        $scope.currentConcept = { notation: [ notation ] };
        $scope.conceptProvider.updateConcept($scope.currentConcept)
    };
}
