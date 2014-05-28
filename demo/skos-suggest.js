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

            console.log("transform concept");
            var graph = item[1]['@graph'][0];
            console.log(graph);
            var broaderTerms = [];
            var relatedTerms = [];
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
            }else if(angular.isString(graph.broaderTermGeneral)){
                concept.broader[0] = {uri: graph.broaderTermGeneral};
            }
            if(angular.isArray(graph.relatedTerm)){
                angular.forEach(graph.relatedTerm, function(rterm) {
                    concept.related.push({uri: rterm });
                });
            }else if(angular.isString(graph.relatedTerm)){
                concept.related[0] = {uri: graph.relatedTerm};
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
            var c = $scope.subjectConcept;

            angular.forEach(c.broader, function(broader){
                $scope.gndSubjectConcept.updateConcept(broader);
            });
            angular.forEach(c.related, function(related){
                $scope.gndSubjectConcept.updateConcept(related);
            });
        });
    };
}
