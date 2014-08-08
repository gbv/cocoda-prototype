var demo = angular.module('myApp', ['ngSKOS','ui.bootstrap','ngSuggest']);

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
                de: item.label
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
                de: label
            }
        }
        $scope.gndSubjectConcept.updateConcept($scope.subjectConcept).then(function() {
            $scope.gndSubjectConcept.updateConnected($scope.subjectConcept)
        });
    }
}
