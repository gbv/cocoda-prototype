var cocoda = angular.module('Cocoda', ['ngSKOS','ui.bootstrap','ngSuggest']);

function myController($scope, $http, $q, SkosConceptProvider, OpenSearchSuggestions){

    $scope.activeView = {
        origin: '',
        target: ''
    };
    $scope.setOrigin = function(scheme) {
        if(scheme == ''){
            $scope.activeView.origin = scheme;
        }else if(scheme != $scope.activeView.origin && scheme != ''){
            $scope.originConcept = "";
            $scope.originSubject = "";
            $scope.deleteAll();
            $scope.activeView.origin = scheme;
        }
        if(scheme != '' && scheme == $scope.activeView.target){
            $scope.activeView.origin = scheme;
            $scope.activeView.target = "";
        }
    }
    $scope.setTarget = function(scheme) {
        if(scheme == '' && scheme != $scope.activeView.origin){
            $scope.activeView.target = scheme;
        }else if(scheme != $scope.activeView.target && scheme != $scope.activeView.origin){
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
        
        url: "http://rvk.uni-regensburg.de/api/json/nodes/{searchTerms}",
        transform: function(response){
            return {
                values: response.node.map(function(v) {
                    return {
                        label: v.benennung,
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
        to: []
    };
    $scope.saveFrom = function(origin, item){
        $scope.currentMapping.from[0] = {
            prefLabel: { de: item.prefLabel.de },
            inScheme: { notation: [ origin ] },
            notation: [ item.notation[0] ? item.notation[0] : originConcept.uri ],
            uri: item.uri
        };
    };
    $scope.addTo = function(target, item){
        $scope.currentMapping.to.push({
            prefLabel: { de: item.prefLabel.de },
            inScheme: { notation: [ target ] },
            notation: [ item.notation[0] ],
            uri: item.uri
        });
    };
    $scope.replaceTo = function(target, item){
        $scope.currentMapping.to = [];
        $scope.currentMapping.to.push({
            prefLabel: { de: item.prefLabel.de },
            inScheme: { notation: [ target ] },
            notation: [ item.notation[0] ],
            uri: item.uri
        });
    }
    $scope.deleteAll = function(){
        $scope.currentMapping.to = [];
        $scope.currentMapping.from = [];
    }
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
    $scope.rvkSubjectConcept = new SkosConceptProvider({
        url: "http://rvk.uni-regensburg.de/api/json/node/{uri}",
        transform: function(item) {
            var concept = {
                notation: [ item.node.notation ],
                uri: item.node.notation,
                prefLabel: { de: item.node.benennung },
                altLabel: "" ,
                c: 0
            }
            if(angular.isArray(item.node.register)){
                concept.altLabel = item.node.register;
            }else if(angular.isString(item.node.register)){
                concept.altLabel = [item.node.register];
            }
            if(item.node.has_children == 'yes'){
                concept.c = 1;
            }
            return concept;
        },
        jsonp: 'jsonp'
    });
    $scope.rvkNarrowerConcepts = new SkosConceptProvider({
        url: "http://rvk.uni-regensburg.de/api/json/children/{uri}",
        transform: function(item) {
            console.log(item);
            var concept = {
                notation: [ item.node.notation ],
                uri: item.node.notation,
                prefLabel: { de: item.node.benennung },
                narrower: [],
            };
            if(!item.node.nochildren){
                if(angular.isArray(item.node.children.node)){
                    angular.forEach(item.node.children.node, function(nterm) {
                        concept.narrower.push({uri: nterm.notation, prefLabel: { de: nterm.benennung }, notation: [ nterm.notation ] });
                    });
                } else if(angular.isString(item.node.children.node)){
                    concept.narrower = [{uri: item.node.children.node.notation, prefLabel: { de: item.node.children.node.benennung }, notation: [ item.node.children.node.notation ] }];
                }
            }
            return concept;
        },
        jsonp: 'jsonp'
    });
    $scope.rvkBroaderConcepts = new SkosConceptProvider({
        url: "http://rvk.uni-regensburg.de/api/json/ancestors/{uri}",
        transform: function(item) {
            
            var concept = {
                broader: [],
            };
            if(item.ancestor){
                concept.broader = [{ uri: item.node.ancestor.node.notation, prefLabel:{de: item.node.ancestor.node.benennung}, notation: item.node.ancestor.node.notation }];
            }
            return concept;
        },
        jsonp: 'jsonp'
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
                uri: item.uri ,
                prefLabel: {
                    de: item.label
                }
            };
            // update
            $scope.rvkSubjectConcept.updateConcept($scope.originConcept).then(function() {
                if($scope.originConcept.c == 1){
                    $scope.rvkNarrowerConcepts.updateConcept($scope.originConcept);
                }
            });
            //click
            $scope.clickOriginConcept = function(concept) {
                $scope.rvkSubjectConcept.updateConcept( $scope.originConcept = concept ).then(
                    function() {
                        $scope.originSubject = concept.prefLabel.de; // TODO: nur wenn vorhanden
                        if($scope.originConcept.c == 1){
                            $scope.rvkNarrowerConcepts.updateConcept($scope.originConcept)
                        }
                    }
                );
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
                uri: item.uri ,
                prefLabel: {
                    de: item.label
                }
            };
            // update
            $scope.rvkSubjectConcept.updateConcept($scope.targetConcept).then(function() {
                if($scope.targetConcept.c == 1){
                    $scope.rvkNarrowerConcepts.updateConcept($scope.targetConcept);
                }
            });
            //click
            $scope.clickTargetConcept = function(concept) {
                console.log(concept);
                $scope.rvkSubjectConcept.updateConcept( $scope.targetConcept = concept ).then(
                    function() {
                        $scope.targetSubject = concept.prefLabel.de; // TODO: nur wenn vorhanden
                        if($scope.targetConcept.c == 1){
                            $scope.rvkNarrowerConcepts.updateConcept($scope.targetConcept)
                        }
                    }
                );
            };
        }
    };
    // for filling the concept directly
    $scope.reselectConcept = function(role, concept){
        console.log(role);
        console.log(concept);
        if(role == 'origin'){
            $scope.originConcept = {
                uri: concept.uri,
                label: concept.prefLabel.de
                
            };
            $scope.selectOriginSubject($scope.originConcept)
        }
        else if(role == 'target'){
            $scope.targetConcept = {
                uri: concept.uri,
                label: concept.prefLabel.de
                
            };
            $scope.selectTargetSubject($scope.targetConcept);
        }
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
