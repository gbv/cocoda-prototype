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
            var broaderTerms = [];
            var relatedTerms = [];
            var concept = {
                notation: [ graph.gndIdentifier ],
                prefLabel: { de: graph.preferredName },
                altLabel: graph.variantName ? graph.variantName : '',
                uri: graph['@id'],
                broader: [],
                related: [],
            };
            if(angular.isArray(graph.broaderTermGeneral)){
                angular.forEach(graph.broaderTermGeneral, function(bterm) {
                    concept.broader.push({uri: bterm });
                });
            }else{
                concept.related[0] = {uri: graph.broaderTermGeneral};
            }
            if(angular.isArray(graph.relatedTerm)){
                angular.forEach(graph.relatedTerm, function(rterm) {
                    concept.related.push({uri: rterm });
                });
            }else{
                concept.related[0] = {uri: graph.relatedTerm};
            }
/*
                for(i=0;i<graph.broaderTermGeneral.length;i++){
                    var url = "http://lobid.org/subject?format=full&id=" + graph.broaderTermGeneral[i];
                    url += url.indexOf('?') == -1 ? '?' : '&';
                    url += 'callback=JSON_CALLBACK';
                    var get = $http.jsonp;
                    console.log(url);
                    get(url).then(
                        function(item) {
                            try{
                                var a = item.data[1]['@graph'][0];
                                console.log(item);
                                var b = a.preferredName;
                                console.log(b);
                                return broaderTerms.push(b);
                            } catch(e) {
                                console.error(e);
                                return $q.reject(e);
                            }
                        }, function(item) {
                            console.error(item);
                            return $q.reject(item.data);
                        }
                    )
                }
            if(angular.isArray(graph.relatedTerm)){
                for(i=0;i<graph.relatedTerm.length;i++){
                    var url = "http://lobid.org/subject?format=full&id=" + graph.relatedTerm[i];
                    url += url.indexOf('?') == -1 ? '?' : '&';
                    url += 'callback=JSON_CALLBACK';
                    var get = $http.jsonp;
                    console.log(url);
                    get(url).then(
                        function(item) {
                            try{
                                var a = item.data[1]['@graph'][0];
                                console.log(item);
                                var b = a.preferredName;
                                console.log(b);
                                return relatedTerms.push(b);
                            } catch(e) {
                                console.error(e);
                                return $q.reject(e);
                            }
                        }, function(item) {
                            console.error(item);
                            return $q.reject(item.data);
                        }
                    )
                }
            }
*/
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
        $scope.gndSubjectConcept.updateConcept($scope.subjectConcept);
    };
}
