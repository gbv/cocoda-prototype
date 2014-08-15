var wikidataApp = angular.module('WikidataApp', ['ngSKOS','ui.bootstrap','ngSuggest']);

function schemes(OpenSearchSuggestions, SkosConceptProvider, SkosConceptListProvider) {
    this.wikidata = wikidataScheme(OpenSearchSuggestions, SkosConceptProvider, SkosConceptListProvider);
}

wikidataApp.service('schemes', 
        ["OpenSearchSuggestions","SkosConceptProvider","SkosConceptListProvider",
        schemes]);

function myController($scope, $http, $q, SkosConceptProvider, OpenSearchSuggestions, schemes){
    $scope.schemes = schemes;

    $scope.suggestConcept = $scope.schemes.wikidata.suggest;
    $scope.conceptProvider = $scope.schemes.wikidata.getConcept;

    $scope.selectConceptByNotation = function(notation) {
        $scope.currentConcept = { notation: [ notation ] };
        $scope.conceptProvider.updateConcept($scope.currentConcept)
    };
}
