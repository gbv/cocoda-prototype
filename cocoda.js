var cocoda = angular.module('Cocoda', ['ngSKOS','ui.bootstrap','ngSuggest','cfp.hotkeys']);

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
                    uri: graph['@id'],
                    prefLabel: { de: ""},
                    broader: [],
                    related: [],
                };

                if(graph.preferredName) {
                    concept.prefLabel.de = graph.preferredName;
                }else if(graph.preferredNameForThePlaceOrGeographicName){
                    concept.prefLabel.de = graph.preferredNameForThePlaceOrGeographicName;
                }else if(graph.preferredNameOfThePerson){
                    concept.prefLabel.de = graph.preferredNameOfThePerson;
                }else if(graph.preferredNameEntityForThePerson){
                    concept.prefLabel.de = graph.preferredNameEntityForThePerson;
                }else if(graph.preferredNameForTheConferenceOrEvent){
                    concept.prefLabel.de = graph.preferredNameForTheConferenceOrEvent;
                }else if(graph.preferredNameForTheCorporateBody){
                    concept.prefLabel.de = graph.preferredNameForTheCorporateBody;
                }else if(graph.preferredNameForTheFamily){
                    concept.prefLabel.de = graph.preferredNameForTheFamily;
                }else if(graph.preferredNameForThePerson){
                    concept.prefLabel.de = graph.preferredNameForThePerson;
                }else if(graph.preferredNameForTheSubjectHeading){
                    concept.prefLabel.de = graph.preferredNameForTheSubjectHeading;
                }else if(graph.preferredNameForTheWork){
                    concept.prefLabel.de = graph.preferredNameForTheWork;
                }

                if(graph.variantName){
                    concept.altLabel = graph.variantName;
                }else if(graph.variantNameForThePlaceOrGeographicName){
                    concept.altLabel = graph.variantNameForThePlaceOrGeographicName;
                }else if(graph.variantNameEntityForThePerson){
                    concept.altLabel = graph.variantNameEntityForThePerson;
                }else if(graph.variantNameForTheConferenceOrEvent){
                    concept.altLabel = graph.variantNameForTheConferenceOrEvent;
                }else if(graph.variantNameForTheCorporateBody){
                    concept.altLabel = graph.variantNameForTheCorporateBody;
                }else if(graph.variantNameForTheFamily){
                    concept.altLabel = graph.variantNameForTheFamily;
                }else if(graph.variantNameForThePerson){
                    concept.altLabel = graph.variantNameForThePerson;
                }else if(graph.variantNameForTheSubjectHeading){
                    concept.altLabel = graph.variantNameForTheSubjectHeading;
                }else if(graph.variantNameForTheWork){
                    concept.altLabel = graph.variantNameForTheWork;
                }
                if(angular.isString(concept.altLabel)){
                    concept.altLabel = [ concept.altLabel ];
                }

                var broader = [];
                
                if(graph.broaderTermGeneral){
                    broader = graph.broaderTermGeneral;
                }
                if(graph.broaderTermPartitive){
                    if(broader.length){
                        angular.forEach(graph.broaderTermPartitive, function(bterm){
                            broader.push(bterm);
                        });
                    }else{
                    broader = graph.broaderTermPartitive;
                    }
                }
                if(angular.isArray(broader)){
                    if(broader.length != 0){
                        angular.forEach(broader, function(bterm) {
                            concept.broader.push({uri: bterm });
                        });
                    }
                } else if(angular.isString(broader)){
                    concept.broader = [{uri: broader}];
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
                    notation: v.notation
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
            url: "http://rvk.uni-regensburg.de/api/json/nodes/{searchTerms}",
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
    
    this.wikidata = {
        name: 'Wikidata',
        getConcept: new SkosConceptProvider({
            url: "http://www.wikidata.org/w/api.php?action=wbgetentities&ids={notation}&props=info|labels|descriptions|aliases",
            jsonp: true,
            transform: function(item) {
                console.log(item);
                // TODO
            }
        })
    };
};

cocoda.service('knownSchemes', 
        ["OpenSearchSuggestions","SkosConceptProvider","SkosConceptListProvider",
        knownSchemes]);

/**
 * Controller
 */
function myController($scope, $http, $q, SkosConceptProvider, OpenSearchSuggestions, knownSchemes){
    
    window.addEventListener("keydown", function(e) {
        // space and arrow keys
        if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
            e.preventDefault();
        }
    }, false);
    
    // references to the http-calls
    $scope.schemes = knownSchemes;

    $scope.gndSubjectConcept = knownSchemes.gnd.getConcept;
    $scope.rvkSubjectConcept = knownSchemes.rvk.getConcept;

    $scope.rvkNarrowerConcepts = knownSchemes.rvk.getNarrower;
    $scope.rvkBroaderConcepts = knownSchemes.rvk.getBroader;

    // NG-SUGGEST & NAVBAR FUNCTIONALITY
    $scope.showTargetSearch = false;
    // possible profile scope
    

    $scope.loggedIn = false;

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
            $scope.originConcept = "";
            $scope.originSubject = "";
            $scope.targetConcept = "";
            $scope.targetSubject = "";
        }else if(scheme != $scope.activeView.origin && scheme != ''){
            $scope.activeView.origin = scheme;
            $scope.originConcept = "";
            $scope.originSubject = "";
            $scope.deleteAll();
            $scope.changeTopOrigin(scheme);
        }
        if(scheme != '' && scheme == $scope.activeView.target){
            $scope.activeView.origin = scheme;
            $scope.activeView.target = "";
            $scope.targetConcept = "";
            $scope.targetSubject = "";
            $scope.changeTopOrigin(scheme);
        }
    };
    // target scheme selection behavior
    $scope.setTarget = function(scheme) {
        if(scheme == ''){
            $scope.activeView.target = scheme;
            $scope.targetConcept = "";
            $scope.deleteAll();
            
        }else if(scheme != $scope.activeView.target && scheme != $scope.activeView.origin){
            $scope.activeView.target = scheme;
            $scope.targetConcept = "";
            $scope.targetSubject = "";
            $scope.deleteAll();
            $scope.changeTopTarget(scheme);
        }
    };
    // decide which suggest function to call
    $scope.SuggestConcept = function(scheme){
        scheme = scheme.toLowerCase();
        if ($scope.schemes[scheme]) {
            return $scope.schemes[scheme].suggest;
        }
    };
    /*
    $scope.safeApply = function(fn) { 
        var phase = this.$root.$$phase; 
        if(phase == '$apply' || phase == '$digest') { if(fn) fn(); } else { this.$apply(fn); } };
    */
    
    // TOP CONCEPTS
    
    if($scope.activeView.origin == 'RVK'){
        knownSchemes.rvk.topConcepts.getConceptList().then(function(response){
            $scope.topOriginConcept = response;
        });
    }else if($scope.activeView.origin == 'DDC'){
        
    }
    if($scope.activeView.target == 'RVK'){
        knownSchemes.rvk.topConcepts.getConceptList().then(function(response){
            $scope.topTargetConcept = response;
        });
    }else if($scope.activeView.target == 'DDC'){
        
    }
    $scope.changeTopOrigin = function(scheme){
        if(scheme == 'RVK'){
            knownSchemes.rvk.topConcepts.getConceptList().then(function(response){
                $scope.topOriginConcept = response;
            });
        }else if(scheme == 'DDC'){
            
        }else{
            $scope.topOriginConcept = "";
        }
    }
    $scope.changeTopTarget = function(scheme){
        if(scheme == 'RVK'){
            knownSchemes.rvk.topConcepts.getConceptList().then(function(response){
                $scope.topTargetConcept = response;
            });
        }else if(scheme == 'DDC'){
            
        }else{
            $scope.topTargetConcept = "";
        }
       
    }
    
    // show/hide top concepts
    $scope.showTopConcepts = {
        origin:true,
        target:false
    };
    
    
    // SKOS-MAPPING-COLLECTION/TABLE/OCCURRENCES TO SKOS-CONCEPT-MAPPING
    
    // used in mapping templates to transfer existing mappings into active state
    $scope.insertMapping = function(mapping){
        //complete mappings
        if(mapping.from){
            if(mapping.from[0].inScheme.notation[0] == $scope.activeView.origin && mapping.to[0].inScheme.notation[0] == $scope.activeView.target){
                $scope.currentMapping = angular.copy(mapping);
                // $scope.currentMapping.timestamp = new Date().toISOString().slice(0, 10);
            }
        // single target terms
        }else if(mapping.notation){
            if(mapping.inScheme.notation[0] == $scope.activeView.target){
                var dupes = false;
                angular.forEach($scope.currentMapping.to, function(value,key){
                    if(value.notation[0] == mapping.notation[0]){
                        dupes = true;
                    }
                });
                if(dupes == false){
                    $scope.currentMapping.to.push(mapping);
                }
            }
        }
    };
    // SKOS-MAPPING-COLLECTION/TABLE/OCCURRENCES TO SKOS-CONCEPT
    
    $scope.lookUpMapping = function(mapping){
        $scope.reselectConcept('target', mapping);
    };
    // SKOS-OCCURRENCES TO SKOS-CONCEPT-MAPPING
    
    
    // scope for the created mapping
    $scope.currentMapping = {
        from: [],
        to: [],
        type: '',
        source: '',
        timestamp: ''
    };
    
    // SKOS-CONCEPT TO SKOS-CONCEPT-MAPPING FUNCTIONS
    
    // Choose origin mapping concept
    $scope.saveFrom = function(origin, item){
        if($scope.currentMapping.from[0]){
            if($scope.currentMapping.from[0].notation[0] != item.notation[0]) { 
            $scope.currentMapping.to = [];
            };
        };
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
        var dupes = false;
        angular.forEach($scope.currentMapping.to, function(value) {
            var map = value;
            if($scope.targetConcept.uri && map.uri){
                if($scope.targetConcept.uri == map.uri){
                    dupes = true;
                }
            }else{
                if($scope.targetConcept.notation[0] == map.notation[0]){
                    dupes = true;
                }
            }
        });
        return dupes;
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
    
    // SKOS-CONCEPT
    
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
                        $scope.gndSubjectConcept.updateConnected($scope.originConcept)
                    }
                );
            };
        }else if($scope.activeView.origin == 'RVK'){
            
            // populate with basic data
            $scope.originConcept = {
                notation: [ item.notation ],
                uri: item.notation ,
                prefLabel: {
                    de: item.label
                }
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
                        if($scope.originConcept.hasChildren == true){
                            $scope.rvkNarrowerConcepts.updateConcept($scope.originConcept).then(function(){
                                $scope.originConcept.altLabel = angular.copy($scope.tempConcept.altLabel);
                                $scope.rvkBroaderConcepts.updateConcept($scope.tempConcept).then(function(){
                                    $scope.originConcept.broader = $scope.tempConcept.broader;
                                })
                            });
                        }else{
                            
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
                        $scope.gndSubjectConcept.updateConnected($scope.targetConcept)
                    }
                );
            };
        }else if($scope.activeView.target == 'RVK'){

            // populate with basic data
            $scope.targetConcept = {
                notation: [ item.notation ],
                uri: item.notation ,
                prefLabel: {
                    de: item.label
                }
            };
            // update concept
            $scope.rvkSubjectConcept.updateConcept($scope.targetConcept).then(function() {
                // fill buffer concept, so targetConcept won't be overwritten
                $scope.tempConcept = angular.copy($scope.targetConcept);
                if($scope.targetConcept.hasChildren == true){
                    $scope.rvkNarrowerConcepts.updateConcept($scope.targetConcept).then(function(){

                        $scope.targetConcept.altLabel = angular.copy($scope.tempConcept.altLabel);
                        $scope.rvkBroaderConcepts.updateConcept($scope.tempConcept).then(function(){
                            $scope.targetConcept.broader = $scope.tempConcept.broader;
                        })
                    });
                }else{

                    $scope.rvkBroaderConcepts.updateConcept($scope.targetConcept).then(function(){
                        $scope.targetConcept.altLabel = $scope.tempConcept.altLabel;
                    });
                }
            });
            // when concept node is clicked
            $scope.clickTargetConcept = function(concept) {

                $scope.rvkSubjectConcept.updateConcept( $scope.targetConcept = concept ).then(function() {
                    // fill buffer concept, so targetConcept won't be overwritten
                    $scope.tempConcept = angular.copy($scope.targetConcept);
                    if($scope.targetConcept.hasChildren == true){
                        $scope.rvkNarrowerConcepts.updateConcept($scope.targetConcept).then(function(){

                            $scope.targetConcept.altLabel = angular.copy($scope.tempConcept.altLabel);
                            $scope.rvkBroaderConcepts.updateConcept($scope.tempConcept).then(function(){
                                $scope.targetConcept.broader = $scope.tempConcept.broader;
                            })
                        });
                    }else{

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
                    notation: concept.notation ? concept.notation : "",
                    uri: concept.uri ? concept.uri : concept.notation,
                    label: concept.prefLabel.de
                };
            }else if(concept.label){
                $scope.originConcept = {
                    notation: concept.notation ? concept.notation : "",
                    uri: concept.uri ? concept.uri : concept.notation,
                    label: concept.label
                };
            }else{
                $scope.originConcept = {
                    notation: concept.notation ? concept.notation : "",
                    uri: concept.uri ? concept.uri : concept.notation,
                };
            }
            $scope.selectOriginSubject($scope.originConcept);
        }
        else if(role == 'target'){
            if(concept.prefLabel){
                $scope.targetConcept = {
                    notation: concept.notation ? concept.notation : "",
                    uri: concept.uri ? concept.uri : concept.notation,
                    label: concept.prefLabel.de
                };
            }else if(concept.label){
                $scope.targetConcept = {
                    notation: concept.notation ? concept.notation : "",
                    uri: concept.uri ? concept.uri : concept.notation,
                    label: concept.label
                };
            }else{
                $scope.targetConcept = {
                    notation: concept.notation ? concept.notation : "",
                    uri: concept.uri ? concept.uri : concept.notation,
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
