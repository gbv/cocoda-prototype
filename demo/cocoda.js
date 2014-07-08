var cocoda = angular.module('Cocoda', ['ngSKOS','ui.bootstrap','ngSuggest']);

function myController($scope, $http, $q, SkosConceptProvider, OpenSearchSuggestions){

    $scope.activeView = {
        origin: '',
        target: ''
    };
    $scope.setOrigin = function(scheme) {
        if(scheme == ''){
            $scope.activeView.origin = scheme;
        }else if(scheme != $scope.activeView.origin){
            $scope.originConcept = "";
            $scope.originSubject = "";
            $scope.deleteAll();
            $scope.activeView.origin = scheme;
        }
    }
    $scope.setTarget = function(scheme) {
        if(scheme == ''){
            $scope.activeView.target = scheme;
        }else if(scheme != $scope.activeView.target){
            $scope.targetConcept = "";
            $scope.targetSubject = "";
            $scope.deleteAll();
            $scope.activeView.target = scheme;
        }
    }
    $scope.SubjectOriginSuggest = function(scheme){
        if(scheme == 'GND'){
            return $scope.gndSubjectSuggest;
        }else if(scheme == 'RVK'){
            return $scope.rvkSubjectSuggest;
        }
    }
    $scope.SubjectTargetSuggest = function(scheme){
        if(scheme == 'GND'){
            return $scope.gndSubjectSuggest;
        }else if(scheme == 'RVK'){
            return $scope.rvkSubjectSuggest;
        }
    }
    // Suggestions API via lobid.org
    
    $scope.gndSubjectSuggest = new OpenSearchSuggestions({
        
        url: "http://api.lobid.org/subject?format=ids&name=",
        transform: function(response) {
            return {
                values: response.map(function(s) {
                    return {
                        label: s.label,
                        uri: s.value
                    };
                }),
            };
        },
        jsonp: true
    });
    
    $scope.rvkSubjectSuggest = new OpenSearchSuggestions({
        
        url: "http://rvk.uni-regensburg.de/api/json/register/{searchTerms}?limit=20",
        transform: function(response){
            return {
                values: response.Register.map(function(v) {
                    return {
                        label: v.begriff,
                        uri: v.notation
                    };
                }),
            };
        },
        jsonp: 'jsonp'
    });


    /*
    $scope.safeApply = function(fn) { 
        var phase = this.$root.$$phase; 
        if(phase == '$apply' || phase == '$digest') { if(fn) fn(); } else { this.$apply(fn); } };
    */
    $scope.currentMapping = {
        from: [],
        targets: []
    };    
    $scope.saveFrom = function(origin,item){
        $scope.deleteAll();
        $scope.currentMapping.from[0] = {
            origin: origin,
            prefLabel: { de: item.prefLabel.de },
            inScheme: { notation: [ $scope.activeView.origin ] },
            notation: [ item.notation[0] ? item.notation[0] : originConcept.uri ],
            uri: item.uri
        };
    };
    $scope.addTo = function(target,item){
        $scope.currentMapping.targets.push({
            target: target,
            prefLabel: { de: item.prefLabel.de },
            inScheme: { notation: [ $scope.activeView.target ] },
            notation: [ item.notation[0] ],
            uri: item.uri
        });
    };
    $scope.replaceTo = function(target,item){
        $scope.currentMapping.targets = [];
        $scope.currentMapping.targets.push({
            target: target,
            prefLabel: { de: item.prefLabel.de },
            inScheme: { notation: [ $scope.activeView.target ] },
            notation: [ item.notation[0] ],
            uri: item.uri
        });
    }
    $scope.deleteAll = function(){
        $scope.currentMapping.targets = [];
        $scope.currentMapping.from = [];
    }
    $scope.deleteTarget = function(idx){
        $scope.currentMapping.targets.splice(idx, 1);
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

    $scope.selectOriginSubject = function(item) {

        // populate with basic data
        if($scope.activeView.origin == 'GND'){

            $scope.originConcept = {
                uri: item.uri,
                prefLabel: {
                    de: item.label
                }
            };
            // update
            $scope.gndSubjectConcept.updateConcept($scope.originConcept).then(function() {
                $scope.gndSubjectConcept.updateConnected($scope.originConcept)
            });

            // click
            $scope.clickOriginConcept = function(concept) {
                console.log(concept);
                $scope.gndSubjectConcept.updateConcept( $scope.originConcept = concept ).then(
                    function() {
                        $scope.originSubject = concept.prefLabel.de; // TODO: nur wenn vorhanden
                        $scope.gndSubjectConcept.updateConnected($scope.originConcept)
                    }
                );
            };
        }else if($scope.activeView.origin == 'RVK'){
            
            $scope.originConcept = {
                notation: [ item.uri ] ,
                uri: [ item.uri ],
                prefLabel: {
                    de: item.label
                }
            };
        }
    };
    $scope.selectTargetSubject = function(item) {

        // populate with basic data
        if($scope.activeView.target == 'GND'){

            $scope.targetConcept = {
                uri: item.uri,
                prefLabel: {
                    de: item.label
                }
            };
            // update
            $scope.gndSubjectConcept.updateConcept($scope.targetConcept).then(function() {
                $scope.gndSubjectConcept.updateConnected($scope.targetConcept)
            });

            // click
            $scope.clickTargetConcept = function(concept) {
                console.log(concept);
                $scope.gndSubjectConcept.updateConcept( $scope.targetConcept = concept ).then(
                    function() {
                        $scope.targetSubject = concept.prefLabel.de; // TODO: nur wenn vorhanden
                        $scope.gndSubjectConcept.updateConnected($scope.targetConcept)
                    }
                );
            };
        }else if($scope.activeView.target == 'RVK'){
            
            $scope.targetConcept = {
                notation: [ item.uri ],
                uri: [ item.uri ],
                prefLabel: {
                    de: item.label
                }
            };
        }
    };
    // for filling the concept directly
    $scope.selectSampleOriginConcept = function(label, uri){
        
        $scope.originConcept = {
            uri: uri,
            prefLabel: {
                de: label
            }
        }
        $scope.gndSubjectConcept.updateConcept($scope.originConcept).then(function() {
            $scope.gndSubjectConcept.updateConnected($scope.originConcept)
        });
    }
    $scope.selectSampleTargetConcept = function(label, uri){
        
        $scope.targetConcept = {
            uri: uri,
            prefLabel: {
                de: label
            }
        }
        $scope.gndSubjectConcept.updateConcept($scope.targetConcept).then(function() {
            $scope.gndSubjectConcept.updateConnected($scope.targetConcept)
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
