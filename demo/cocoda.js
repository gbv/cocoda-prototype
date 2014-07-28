var cocoda = angular.module('Cocoda', ['ngSKOS','ui.bootstrap','ngSuggest']);

/**
 * Konfiguration aller unterstützen Concept Schemes
 */
function knownSchemes(OpenSearchSuggestions, SkosConceptProvider, SkosConceptListProvider) {
    this.gnd = {
        name: 'GND',
        // Suggestions API via lobid.org
        suggest: new OpenSearchSuggestions({
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
        }),
        getNarrower: new SkosConceptProvider({
            url: "http://lobid.org/subject?format=full&id={uri}"
        }),
        getConcept: new SkosConceptProvider({
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
        })
    };

    var rvkTransform = function(nodes) {
        return {
            values: nodes.map(function(v) {
                return {
                    label: v.benennung,
                    uri: v.notation
                };
            }),
        };
    };

    this.rvk = {
        name: 'RVK',
        topConcepts: new SkosConceptListProvider({
            url: "http://rvk.uni-regensburg.de/api/json/children",
            jsonp: 'jsonp',
            transform: function(response) { 
                return rvkTransform(response.node.children.node) 
            },
        }), 
        suggest: new OpenSearchSuggestions({
            url: "http://rvk.uni-regensburg.de/api/json/nodes/{searchTerms}?limit=20",
            jsonp: 'jsonp',
            transform: function(response) { 
                return rvkTransform(response.node) 
            },
            jsonp: 'jsonp'
        }),
        // get main concept
        getConcept: new SkosConceptProvider({
            url: "http://rvk.uni-regensburg.de/api/json/node/{notation}",
            transform: function(item) {
                var concept = {
                    notation: [ item.node.notation ],
                    uri: item.node.notation,
                    prefLabel: { de: item.node.benennung },
                    altLabel: "" ,
                    hasChildren: false
                }
                if(angular.isArray(item.node.register)){
                    concept.altLabel = item.node.register;
                }else if(angular.isString(item.node.register)){
                    concept.altLabel = [item.node.register];
                }
                if(item.node.has_children == 'yes'){
                    concept.hasChildren = true;
                }
                return concept;
            },
            jsonp: 'jsonp'
        }),
        // get all direct children of the concept
        getNarrower: new SkosConceptProvider({
            url: "http://rvk.uni-regensburg.de/api/json/children/{notation}",
            transform: function(item) {

                var concept = {
                    notation: [ item.node.notation ],
                    uri: item.node.notation,
                    prefLabel: { de: item.node.benennung },
                    narrower: [],
                    broader: [],
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
        }),
        // get the direct ancestor of the concept
        getBroader: new SkosConceptProvider({
            url: "http://rvk.uni-regensburg.de/api/json/ancestors/{notation}",
            transform: function(item) {
                var concept = { 
                    notation: [ item.node.notation ],
                    uri: item.node.notation,
                    prefLabel: { de: item.node.benennung },
                    broader: [],
                };
                if(item.node.ancestor){
                    concept.broader.push({ notation: [ item.node.ancestor.node.notation ], uri: item.node.ancestor.node.notation, prefLabel: { de: item.node.ancestor.node.benennung } })
                }
                return concept;
            },
            jsonp: 'jsonp'
        }),
        

    };
    // TODO: this.ddc
};

cocoda.service('knownSchemes', 
        ["OpenSearchSuggestions","SkosConceptProvider","SkosConceptListProvider",
        knownSchemes]);

/**
 * Controller
 */
function myController($scope, $http, $q, SkosConceptProvider, OpenSearchSuggestions, knownSchemes){
    
    // get RVK top concepts
    knownSchemes.rvk.topConcepts.getConceptList().then(function(response){
        $scope.rvkTop = response;
    });
    // used in mapping templates to transfer existing mappings into active state
    $scope.insertMapping = function(mapping){
        if(mapping.from[0].inScheme.notation[0] == $scope.activeView.origin && mapping.to[0].inScheme.notation[0] == $scope.activeView.target){
            $scope.currentMapping = angular.copy(mapping);
            $scope.currentMapping.timestamp = new Date().toISOString().slice(0, 10);
        }
    };
    // possible profile scope
    $scope.ownDB = {
        name: "VZG"
    }
    // active source and target schemes
    $scope.activeView = {
        origin: 'GND',
        target: 'RVK'
    };
    // source scheme selection behavior
    $scope.setOrigin = function(scheme) {
        if(scheme == ''){
            $scope.activeView.origin = scheme;
            $scope.activeView.target = scheme;
            $scope.deleteAll();
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
    // target scheme selection behavior
    $scope.setTarget = function(scheme) {
        if(scheme == '' && scheme != $scope.activeView.origin){
            $scope.activeView.target = scheme;
            $scope.deleteAll();
            
        }else if(scheme != $scope.activeView.target && scheme != $scope.activeView.origin){
            $scope.targetConcept = "";
            $scope.targetSubject = "";
            $scope.deleteAll();
            $scope.activeView.target = scheme;
        }
    }
    // decide which suggest function to call
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
    // references to the http-calls
    $scope.gndSubjectSuggest = knownSchemes.gnd.suggest;
    $scope.gndSubjectConcept = knownSchemes.gnd.getConcept;
    $scope.rvkSubjectSuggest = knownSchemes.rvk.suggest;
    $scope.rvkSubjectConcept = knownSchemes.rvk.getConcept;
    $scope.rvkNarrowerConcepts = knownSchemes.rvk.getNarrower;
    $scope.rvkBroaderConcepts = knownSchemes.rvk.getBroader;
    /*
    $scope.safeApply = function(fn) { 
        var phase = this.$root.$$phase; 
        if(phase == '$apply' || phase == '$digest') { if(fn) fn(); } else { this.$apply(fn); } };
    */
    
    // scope for the created mapping
    $scope.currentMapping = {
        from: [],
        to: [],
        type: '',
        source: '',
        timestamp: ''
    };
    // Choose origin mapping concept
    $scope.saveFrom = function(origin, item){
        $scope.currentMapping.from[0] = {
            prefLabel: { de: item.prefLabel.de },
            inScheme: { notation: [ origin ] },
            notation: [ item.notation[0] ? item.notation[0] : originConcept.uri ],
            uri: item.uri
        };
    };
    // Add target mapping concept to list
    $scope.addTo = function(target, item){
        $scope.currentMapping.to.push({
            prefLabel: { de: item.prefLabel.de },
            inScheme: { notation: [ target ] },
            notation: [ item.notation[0] ],
            uri: item.uri
        });
    };
    // check, if the chosen mapping concept is already in the list
    $scope.checkDuplicate = function(){
        var res = false;
        angular.forEach($scope.currentMapping.to, function(value,key) {
            var map = value;
            if($scope.targetConcept.uri == map.uri){
                res = true;
            }
        });
        return res;
    };
    // replace all target mappings with selected one
    $scope.replaceTo = function(target, item){
        $scope.currentMapping.to = [];
        $scope.currentMapping.to.push({
            prefLabel: { de: item.prefLabel.de },
            inScheme: { notation: [ target ] },
            notation: [ item.notation[0] ],
            uri: item.uri
        });
    };
    // clear all origin and target mappings
    $scope.deleteAll = function(){
        $scope.currentMapping.to = [];
        $scope.currentMapping.from = [];
    };
    // used for buffering broader terms in RVK
    $scope.tempConcept = {
            notation: [] ,
            uri: "",
            prefLabel: {
                de:""
            },
            broader:"",
        };
    // scope for notation inputs in topConcepts
    $scope.originNotation = {};
    $scope.targetNotation = {};
    
    // fill origin concept
    $scope.selectOriginSubject = function(item) {
        
        // check for selected concept scheme
        if($scope.activeView.origin == 'GND'){
        
            // populate with basic data
            $scope.originConcept = {
                uri: item.uri,
                prefLabel: {
                    de: item.label
                }
            };
            // update concept
            $scope.gndSubjectConcept.updateConcept($scope.originConcept).then(function() {
                $scope.gndSubjectConcept.updateConnected($scope.originConcept)
            });

            // when concept node is clicked
            $scope.clickOriginConcept = function(concept) {
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
                    },
                };

                // update concept
                $scope.rvkSubjectConcept.updateConcept($scope.originConcept).then(function() {
                    // fill buffer concept, so originConcept won't be overwritten
                    $scope.tempConcept = angular.copy($scope.originConcept);
                    $scope.originSubject = $scope.originConcept.prefLabel.de;
                    if($scope.originConcept.hasChildren == true){
                        $scope.rvkNarrowerConcepts.updateConcept($scope.originConcept).then(function(){
                            $scope.originConcept.altLabel = angular.copy($scope.tempConcept.altLabel);
                            $scope.rvkBroaderConcepts.updateConcept($scope.tempConcept).then(function(){
                                $scope.originConcept.broader = $scope.tempConcept.broader;
                            })
                        });
                    }else{
                        $scope.tempConcept = angular.copy($scope.originConcept);

                        $scope.rvkBroaderConcepts.updateConcept($scope.originConcept).then(function(){
                            $scope.originConcept.altLabel = $scope.tempConcept.altLabel;
                        });
                    }
                });
            // when concept node is clicked
            $scope.clickOriginConcept = function(concept) {
                
                $scope.rvkSubjectConcept.updateConcept( $scope.originConcept = concept ).then(
                    function() {
                        // fill buffer concept, so originConcept won't be overwritten
                        $scope.tempConcept = angular.copy($scope.originConcept);
                        $scope.originSubject = $scope.originConcept.prefLabel.de; // TODO: nur wenn vorhanden
                        if($scope.originConcept.hasChildren == true){
                            $scope.rvkNarrowerConcepts.updateConcept($scope.originConcept).then(function(){
                                $scope.originConcept.altLabel = angular.copy($scope.tempConcept.altLabel);
                                $scope.rvkBroaderConcepts.updateConcept($scope.tempConcept).then(function(){
                                    $scope.originConcept.broader = $scope.tempConcept.broader;
                                })
                            });
                        }else{
                            $scope.tempConcept = angular.copy($scope.originConcept);
                            
                            $scope.rvkBroaderConcepts.updateConcept($scope.originConcept).then(function(){
                                $scope.originConcept.altLabel = $scope.tempConcept.altLabel;
                    });
                        }
                    }
                );
            };

        }
    };
    
    // fill target concept
    $scope.selectTargetSubject = function(item) {
        
        // check for selected concept scheme
        if($scope.activeView.target == 'GND'){

            // populate with basic data
            $scope.targetConcept = {
                uri: item.uri,
                prefLabel: {
                    de: item.label
                }
            };
            // update concept
            $scope.gndSubjectConcept.updateConcept($scope.targetConcept).then(function() {
                $scope.gndSubjectConcept.updateConnected($scope.targetConcept)
            });

            // when concept node is clicked
            $scope.clickTargetConcept = function(concept) {
                $scope.gndSubjectConcept.updateConcept( $scope.targetConcept = concept ).then(
                    function() {
                        $scope.targetSubject = concept.prefLabel.de; // TODO: nur wenn vorhanden
                        $scope.gndSubjectConcept.updateConnected($scope.targetConcept)
                    }
                );
            };
        }else if($scope.activeView.target == 'RVK'){

            // populate with basic data
            $scope.targetConcept = {
                notation: [ item.uri ],
                uri: item.uri ,
                prefLabel: {
                    de: item.label
                }
            };
            // update concept
            $scope.rvkSubjectConcept.updateConcept($scope.targetConcept).then(function() {
                // fill buffer concept, so originConcept won't be overwritten
                $scope.tempConcept = angular.copy($scope.targetConcept);
                $scope.targetSubject = $scope.targetConcept.prefLabel.de;
                if($scope.targetConcept.hasChildren == true){
                    $scope.rvkNarrowerConcepts.updateConcept($scope.targetConcept).then(function(){

                        $scope.targetConcept.altLabel = angular.copy($scope.tempConcept.altLabel);
                        $scope.rvkBroaderConcepts.updateConcept($scope.tempConcept).then(function(){
                            $scope.targetConcept.broader = $scope.tempConcept.broader;
                        })
                    });
                }else{
                    $scope.tempConcept = angular.copy($scope.targetConcept);

                    $scope.rvkBroaderConcepts.updateConcept($scope.targetConcept).then(function(){
                        $scope.targetConcept.altLabel = $scope.tempConcept.altLabel;
                    });
                }
            });
            // when concept node is clicked
            $scope.clickTargetConcept = function(concept) {

                $scope.rvkSubjectConcept.updateConcept( $scope.targetConcept = concept ).then(function() {
                    // fill buffer concept, so originConcept won't be overwritten
                    $scope.tempConcept = angular.copy($scope.targetConcept);
                    $scope.targetSubject = $scope.targetConcept.prefLabel.de; // TODO: nur wenn vorhanden
                    if($scope.targetConcept.hasChildren == true){
                        $scope.rvkNarrowerConcepts.updateConcept($scope.targetConcept).then(function(){

                            $scope.targetConcept.altLabel = angular.copy($scope.tempConcept.altLabel);
                            $scope.rvkBroaderConcepts.updateConcept($scope.tempConcept).then(function(){
                                $scope.targetConcept.broader = $scope.tempConcept.broader;
                            })
                        });
                    }else{
                        $scope.tempConcept = angular.copy($scope.targetConcept);

                        $scope.rvkBroaderConcepts.updateConcept($scope.targetConcept).then(function(){
                            $scope.targetConcept.altLabel = $scope.tempConcept.altLabel;
                        });

                    }
                });
            };
        }
    };
    // for filling the concept directly on selection
    
    $scope.reselectConcept = function(role, concept){
        if(role == 'origin'){
            if(concept.prefLabel){
                $scope.originConcept = {
                    uri: concept.uri,
                    label: concept.prefLabel.de
                };
            }else if(concept.label){
                $scope.originConcept = {
                    uri: concept.uri,
                    label: concept.label
                };
            }else{
                $scope.originConcept = {
                    uri: concept.uri,
                };
            }
            $scope.selectOriginSubject($scope.originConcept)
        }
        else if(role == 'target'){
            if(concept.prefLabel){
                $scope.targetConcept = {
                    uri: concept.uri,
                    label: concept.prefLabel.de
                };
            }else if(concept.label){
                $scope.targetConcept = {
                    uri: concept.uri,
                    label: concept.label
                };
            }else{
                $scope.targetConcept = {
                    uri: concept.uri,
                };
            }
            $scope.selectTargetSubject($scope.targetConcept);
        }
    }
}
cocoda.run(function($rootScope,$http) {
    
    // load placeholder samples

    $rootScope.mappingSample = {};
    $http.get('data/mapping-1.json').success(function(data){
        $rootScope.mappingSample = data;
    });
    $rootScope.mappingSampleGND = {};
    $http.get('data/mapping-2.json').success(function(data){
        $rootScope.mappingSampleGND = data;
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
