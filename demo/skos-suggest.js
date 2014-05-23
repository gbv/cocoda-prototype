var demo = angular.module('myApp', ['ngSKOS','ui.bootstrap','ngSuggest']);

function myController($scope, SkosConceptProvider, OpenSearchSuggestions){

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
            //console.log(item);

            var graph = item[1]['@graph'][0];
            console.log(graph);

            var concept = {
               notation: [ graph.gndIdentifier ],
                prefLabel: { en: graph.preferredName },
            };

            // TODO: weitere Eigenschaften...
            
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
        $scope.gndSubjectConcept.updateConcept($scope.subjectConcept);
    };
}
