var cocoda = angular.module('Cocoda', ['ngSKOS','ui.bootstrap','ngSuggest']);

/**
 * Konfiguration aller unterstützen Concept Schemes
 */
cocoda.service('cocodaSchemes', 
    ["OpenSearchSuggestions","SkosConceptSource","SkosConceptListSource",
function (OpenSearchSuggestions, SkosConceptSource, SkosConceptListSource) {
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
        getNarrower: new SkosConceptSource({
            url: "http://lobid.org/subject?format=full&id={uri}"
        }),
        getConcept: new SkosConceptSource({
            url: "http://lobid.org/subject?format=full&id={uri}",
            transform: function(item) {
                
                var graph = item[1]['@graph'][0];
                
                var concept = {
                    notation: [ graph.gndIdentifier ],
                    uri: graph['@id'],
                    prefLabel: { de: ""},
                    broader: [],
                    related: [],
                    altLabel: { de: [] },
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
                    concept.altLabel.de = graph.variantName;
                }else if(graph.variantNameForThePlaceOrGeographicName){
                    concept.altLabel.de = graph.variantNameForThePlaceOrGeographicName;
                }else if(graph.variantNameEntityForThePerson){
                    concept.altLabel.de = graph.variantNameEntityForThePerson;
                }else if(graph.variantNameForTheConferenceOrEvent){
                    concept.altLabel.de = graph.variantNameForTheConferenceOrEvent;
                }else if(graph.variantNameForTheCorporateBody){
                    concept.altLabel.de = graph.variantNameForTheCorporateBody;
                }else if(graph.variantNameForTheFamily){
                    concept.altLabel.de = graph.variantNameForTheFamily;
                }else if(graph.variantNameForThePerson){
                    concept.altLabel.de = graph.variantNameForThePerson;
                }else if(graph.variantNameForTheSubjectHeading){
                    concept.altLabel.de = graph.variantNameForTheSubjectHeading;
                }else if(graph.variantNameForTheWork){
                    concept.altLabel.de = graph.variantNameForTheWork;
                }
                if(angular.isString(concept.altLabel.de)){
                    concept.altLabel.de = [ concept.altLabel.de ];
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
                    prefLabel: { de: v.benennung },
                    notation: [ v.notation ]
                };
            }),
        };
    };

    this.rvk = {
        name: 'RVK',
        topConcepts: new SkosConceptListSource({
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
                return {
                    values: response.node.map(function(node) {
                        return {
                            label: node.benennung,
                            notation: node.notation
                        };
                    })
                };
            },
            jsonp: 'jsonp'
        }),
        // get main concept
        getConcept: new SkosConceptSource({
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
        getNarrower: new SkosConceptSource({
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
        getBroader: new SkosConceptSource({
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
    
    this.ddc = {
        name: 'DDC',
        getConcept: new SkosConceptSource({
            url:"http://esx-151.gbv.de/?view=notation&key={notation}&exact=true",
            transform: function(item){
                var concept = {
                    notation: [],
                    prefLabel: {},
                    broader: []
                };
                if(item[0]){
                    var c = item[0].value;
                    concept = {
                        notation: c.notation,
                        prefLabel: c.prefLabel,
                        broader: c.broader
                    }
                }
                return concept;
            },
            jsonp: true
        }),

        getNarrower: new SkosConceptSource({
            url:"http://esx-151.gbv.de/?view=broader&key={notation}&exact=true",
            transform: function(item){
                var concept = {
                    narrower: []
                }
                angular.forEach(item, function(nterm){
                    concept.narrower.push({ notation: nterm.value.notation, prefLabel: nterm.value.prefLabel });
                });  
                return concept;
            },
            jsonp: true
        }),
        suggest: new OpenSearchSuggestions({
            url: "http://esx-151.gbv.de/?view=prefLabel&key=",
            transform: function(response) {
                return {
                    values: response.map(function(s) {
                        return {
                            label: s.key,
                            notation: s.value.notation[0]
                        };
                    }),
                };
            },
            jsonp: true
        }),
    };
    
    this.wikidata = {
        name: 'Wikidata',
        getConcept: new SkosConceptSource({
            url: "http://www.wikidata.org/w/api.php?action=wbgetentities&ids={notation}&props=info|labels|descriptions|aliases",
            jsonp: true,
            transform: function(item) {
                console.log(item);
                // TODO
            }
        })
    };
}]);
/**
 * Controller
 */
cocoda.controller('myController',[
    '$rootScope','$scope','$http','$q','SkosConceptSource','OpenSearchSuggestions','cocodaSchemes',
    function ($rootScope, $scope, $http, $q, SkosConceptSource, OpenSearchSuggestions, cocodaSchemes){
    
    // references to the http-calls
    $scope.schemes = cocodaSchemes;

    $scope.gndSubjectConcept = cocodaSchemes.gnd.getConcept;
    $scope.rvkSubjectConcept = cocodaSchemes.rvk.getConcept;
    $scope.ddcSubjectConcept = cocodaSchemes.ddc.getConcept;

    $scope.rvkNarrowerConcepts = cocodaSchemes.rvk.getNarrower;
    $scope.rvkBroaderConcepts = cocodaSchemes.rvk.getBroader;
    
    $scope.ddcNarrowerConcepts = cocodaSchemes.ddc.getNarrower;
    $scope.ddcBroaderConcepts = cocodaSchemes.ddc.getBroader;
    

    // NG-SUGGEST & NAVBAR FUNCTIONALITY
    $scope.showTargetSearch = false;
    $scope.showOriginSearch = true;
    // possible profile scope
    

    $scope.loggedIn = false;

    // active source and target schemes
    $scope.activeView = {
        origin: 'GND',
        target: 'RVK'
    };
    $scope.searchMode = {
        origin: "Label",
        target: "Label"
    }
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
            $scope.clearTargets();
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
    // scope for the created mapping
    $scope.currentMapping = {
        from:{
            conceptSet: []
        },
        to:{
            conceptSet: []
        },
        type: '',
        source: '',
        timestamp: ''
    };
    // Save current mapping
    $scope.lastSavedMapping = {};
    $scope.saveStatus = {
        type: "",
        message: ""
    }
    $scope.showMappingMessage = false;
    $scope.SaveMappingURL = "http://esx-151.gbv.de/mapping/insert";
    $scope.SaveCurrentMapping = function() {
        if($scope.loggedIn === true){
            $scope.currentMapping.timestamp = new Date().toISOString().slice(0, 10);
            $http.post($scope.SaveMappingURL, $scope.currentMapping)
            .success(function(data, status, headers, config) {
                $scope.lastSavedMapping = angular.copy($scope.currentMapping);
                $scope.saveStatus = {
                    type: status,
                    success: true,
                    message: "Mapping Saved!"
                }
                $scope.showMappingMessage = true;
            })
            .error(function(data, status, headers, config) {
                $scope.saveStatus = {
                    type: status,
                    success: false,
                    message: "Saving Failed!"
                }
                $scope.showMappingMessage = true;
            });
        }
    }
    $scope.blob = "";
    $scope.saveLocally = function(){
        var type = "text/javascript";
        var object = JSON.stringify($scope.currentMapping);
        $scope.blob = new Blob([object], { type: type });
        var filename = angular.copy($scope.currentMapping.from.conceptSet[0].notation[0]);
        $scope.saveHREF = window.URL.createObjectURL($scope.blob);
        $scope.saveDataURL = [ type, filename, $scope.saveHREF ].join(':');
    }
    $scope.cleanUp = function(){
        setTimeout(function(){
            window.URL.revokeObjectURL($scope.blob);
        },1500);
    }
    $scope.$watch('currentMapping', function(){
        $scope.showMappingMessage = false;
        $scope.saveStatus = {
            type: "",
            message: ""
        }
        $scope.saveHREF = "";
        $scope.saveDataURL = "";
    }, true);
    $scope.clearTargets = function() {
        $scope.currentMapping.to.conceptSet = [];
    };
    
    // Mapping database requests
    $scope.mappingTargets = 'all';
    $scope.showMappingTargetSelection = false;
    $scope.requestMappingURL = "http://esx-151.gbv.de/?db=mappings&view=fromNotation&exact=true&key=";
    $scope.retrievedMapping = [];
    $scope.transformData = function(data){
        angular.forEach(data, function(d){
            var mr = d.value.mappingRelevance;
            var mt = d.value.mappingType;
            var mapping = {
                creator: d.value.creator,
                mappingRelevance: mr,
                mappingType: mt,
                from: d.value.from,
                to: d.value.to
            }
            if(mr == 0.2){
                mapping.mappingType = "low";
            }else if(mr == 0.5){
                mapping.mappingType = "medium";
            }
            if(mt && !mr){
                
                if(mt == 'closeMatch'){
                    mapping.mappingRelevance = 0.8;
                    mapping.mappingType = "high";
                }else if(mt == 'exactMatch'){
                    mapping.mappingRelevance = 1.0;
                    mapping.mappingType = "very high";
                }
            }
            $scope.retrievedMapping.push(mapping);
        });
    }
    $scope.requestMappings = function(target){
        $scope.retrievedMapping = [];
        if($scope.originConcept.notation[0] == "612.112" && $scope.activeView.origin == "DDC"){ 
            if(target == 'all'){
                $scope.retrievedMapping = angular.copy($scope.mappingSampleDDC);
            }else if(target == 'GND'){
                $scope.retrievedMapping = angular.copy($scope.mappingSampleNew);
            }else if(target == 'RVK'){
                $scope.retrievedMapping = angular.copy($scope.mappingSampleDDCRVK);
            }else{
                $scope.retrievedMapping = [];
            }
        }else{
            var url = $scope.requestMappingURL + $scope.originConcept.notation[0];
            var get = $http.jsonp;
            url += url.indexOf('?') == -1 ? '?' : '&';
            url += 'callback=JSON_CALLBACK';

            get(url).success(function(data, status){
                $scope.transformData(data);
                
                if(!$scope.retrievedMapping[0]){
                    $scope.retrievalSuccess = false;
                }
            }).error(function(data, status, headers){
                console.log("Failed!" + status);
            });
        }
    }
    /*
    $scope.safeApply = function(fn) { 
        var phase = this.$root.$$phase; 
        if(phase == '$apply' || phase == '$digest') { if(fn) fn(); } else { this.$apply(fn); } };
    */
    
    // TOP CONCEPTS
    if($scope.activeView.origin == 'RVK'){
        cocodaSchemes.rvk.topConcepts.getConceptList().then(function(response){
            $scope.topOriginConcept = response;
        });
    }else if($scope.activeView.origin == 'DDC'){
            $scope.topOriginConcept = angular.copy($rootScope.ddcTopConcepts);
    }
    if($scope.activeView.target == 'RVK'){
        cocodaSchemes.rvk.topConcepts.getConceptList().then(function(response){
            $scope.topTargetConcept = response;
        });
    }else if($scope.activeView.target == 'DDC'){
            $scope.topTargetConcept = angular.copy($rootScope.ddcTopConcepts);   
    }
    $scope.changeTopOrigin = function(scheme){
        if(scheme == 'RVK'){
            cocodaSchemes.rvk.topConcepts.getConceptList().then(function(response){
                $scope.topOriginConcept = response;
            });
        }else if(scheme == 'DDC'){
            $scope.topOriginConcept = angular.copy($rootScope.ddcTopConcepts);  
        }else{
            $scope.topOriginConcept = "";
        }
    }
    $scope.changeTopTarget = function(scheme){
        if(scheme == 'RVK'){
            cocodaSchemes.rvk.topConcepts.getConceptList().then(function(response){
                $scope.topTargetConcept = response;
            });
        }else if(scheme == 'DDC'){
            $scope.topTargetConcept = angular.copy($rootScope.ddcTopConcepts);  
        }else{
            $scope.topTargetConcept = "";
        }
       
    }
    
    // show/hide top concepts
    $scope.showTopConcepts = {
        origin:false,
        target:false
    };
    
    $scope.showSuggestions = true;
    $scope.language = "en";
    
    // SKOS-MAPPING-COLLECTION/TABLE/OCCURRENCES TO SKOS-CONCEPT-MAPPING
    
    // used in mapping templates to transfer existing mappings into active state
    $scope.insertMapping = function(mapping, scheme){
        //complete mappings
        if(mapping.from && mapping.to){
            if(mapping.from.inScheme[0].notation == $scope.activeView.origin && mapping.to.inScheme[0].notation == $scope.activeView.target){
                $scope.currentMapping = angular.copy(mapping);
            }
            // $scope.currentMapping.timestamp = new Date().toISOString().slice(0, 10);
        // single target terms
        }else if(mapping.notation){
            if(scheme == $scope.activeView.target || !scheme){
                var dupes = false;
                angular.forEach($scope.currentMapping.to.conceptSet, function(value,key){
                    if(value.notation[0] == mapping.notation[0]){
                        dupes = true;
                    }
                });
                if(dupes == false){
                    $scope.currentMapping.to.conceptSet.push(mapping);
                    $scope.currentMapping.timestamp = "";
                }
            }
        }
    };
    // SKOS-MAPPING-COLLECTION/TABLE/OCCURRENCES TO SKOS-CONCEPT
    
    $scope.lookUpMapping = function(mapping, scheme){
        if(scheme == $scope.activeView.target || !scheme){
            $scope.reselectTargetConcept(mapping);
        }
    };
    // SKOS-OCCURRENCES TO SKOS-CONCEPT-MAPPING
    
    // SKOS-CONCEPT TO SKOS-CONCEPT-MAPPING FUNCTIONS
    
    // Choose origin mapping concept
    $scope.saveFrom = function(origin, item){
        if($scope.currentMapping.from[0]){
            if($scope.currentMapping.from.conceptSet[0].notation[0] != item.notation[0]) { 
                $scope.currentMapping.to.conceptSet = [];
            };
        };
        $scope.currentMapping.from.conceptSet[0] = {
            prefLabel: { de: item.prefLabel.de },
            inScheme: { notation: [ origin ] },
            notation: [ item.notation[0] ? item.notation[0] : originConcept.uri ],
            uri: item.uri
        };
        if($scope.originConcept.notation[0] == "612.112" && $scope.activeView.origin == "DDC"){ 
            $scope.retrievedOccurrences = angular.copy($scope.occurrencesSample);
            $scope.retrievedSuggestions = angular.copy($scope.rvkSuggestions);
        }else{
            $scope.retrievedOccurrences = [];
            $scope.retrievedSuggestions = [];
        }
    };
    // Add target mapping concept to list
    $scope.addTo = function(target, item){
        $scope.currentMapping.to.conceptSet.push({
            prefLabel: { de: item.prefLabel.de },
            inScheme: { notation: [ target ] },
            notation: [ item.notation[0] ],
            uri: item.uri
        });
    };
    // check, if the chosen mapping concept is already in the list
    $scope.checkDuplicate = function(){
        var dupes = false;
        angular.forEach($scope.currentMapping.to.conceptSet, function(value) {
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
        $scope.currentMapping.to.conceptSet = [];
        $scope.currentMapping.to.conceptSet.push({
            prefLabel: { de: item.prefLabel.de },
            inScheme: { notation: [ target ] },
            notation: [ item.notation[0] ],
            uri: item.uri
        });
    };
    // clear all origin and target mappings
    $scope.deleteAll = function(){
        $scope.currentMapping.to.conceptSet = [];
        $scope.currentMapping.from.conceptSet = [];
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
                notation: item.notation ? item.notation : "",
                prefLabel: item.prefLabel,
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
                prefLabel: item.prefLabel,
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

        }else if($scope.activeView.origin == 'DDC'){
            
            $scope.originConcept = {
                notation: [ item.notation ],
                uri: item.uri,
                prefLabel: item.prefLabel ? item.prefLabel : "",
                broader: []
            };
            // update concept
            $scope.ddcSubjectConcept.updateConcept($scope.originConcept).then(function(){
                if($scope.originConcept.notation[0]){
                    $scope.tbConcept = angular.copy($scope.originConcept.broader[0]);
                }
            }).then(function(){
                if($scope.originConcept.notation[0]){
                    $scope.ddcSubjectConcept.updateConcept($scope.tbConcept).then(function(){
                        $scope.originConcept.broader[0] = angular.copy($scope.tbConcept);
                    });
                }
            }).then(function(){
                if($scope.originConcept.notation[0]){
                    $scope.tnConcept = angular.copy($scope.originConcept);
                }
            }).then(function(){
                if($scope.originConcept.notation[0]){
                    $scope.ddcNarrowerConcepts.updateConcept($scope.tnConcept).then(function(){
                        $scope.originConcept.narrower = angular.copy($scope.tnConcept.narrower);
                    });
                }else{
                    $scope.conceptNotFound = true;
                }
            })
            $scope.clickOriginConcept = function(concept) {
                
                $scope.ddcSubjectConcept.updateConcept($scope.originConcept = concept ).then(function(){
                    $scope.tbConcept = angular.copy($scope.originConcept.broader[0]);
                }).then(function(){
                    $scope.ddcSubjectConcept.updateConcept($scope.tbConcept).then(function(){
                        $scope.originConcept.broader[0] = angular.copy($scope.tbConcept);
                    });
                }).then(function(){
                    $scope.tnConcept = angular.copy($scope.originConcept);
                }).then(function(){
                    $scope.ddcNarrowerConcepts.updateConcept($scope.tnConcept).then(function(){
                        $scope.originConcept.narrower = angular.copy($scope.tnConcept.narrower);
                    });
                })
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
                prefLabel: item.prefLabel,
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
                prefLabel: item.prefLabel,
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
        }else if($scope.activeView.target == 'DDC'){
            
            $scope.targetConcept = {
                notation: [ item.notation ],
                uri: item.uri,
                prefLabel: item.prefLabel ? item.prefLabel : "",
                broader: []
            };
            // update concept
            $scope.ddcSubjectConcept.updateConcept($scope.targetConcept).then(function(){
                $scope.tbConcept = angular.copy($scope.targetConcept.broader[0]);  
            }).then(function(){
                $scope.ddcSubjectConcept.updateConcept($scope.tbConcept).then(function(){
                    $scope.targetConcept.broader[0] = angular.copy($scope.tbConcept);
                });
            }).then(function(){
                $scope.tnConcept = angular.copy($scope.targetConcept);
            }).then(function(){
                $scope.ddcNarrowerConcepts.updateConcept($scope.tnConcept).then(function(){
                    $scope.targetConcept.narrower = angular.copy($scope.tnConcept.narrower);
                });
            })
            $scope.clickTargetConcept = function(concept) {
                
                $scope.ddcSubjectConcept.updateConcept($scope.targetConcept = concept ).then(function(){
                    $scope.tbConcept = angular.copy($scope.targetConcept.broader[0]);  

                }).then(function(){
                    $scope.ddcSubjectConcept.updateConcept($scope.tbConcept).then(function(){
                        $scope.targetConcept.broader[0] = angular.copy($scope.tbConcept);
                    });
                }).then(function(){
                    $scope.tnConcept = angular.copy($scope.targetConcept);
                }).then(function(){
                    $scope.ddcNarrowerConcepts.updateConcept($scope.tnConcept).then(function(){
                        $scope.targetConcept.narrower = angular.copy($scope.tnConcept.narrower);
                    });
                })
            };
        }
    };
    // for filling the concept directly on selection
    $scope.reselectOriginConcept = function(concept){

        if(concept.prefLabel){
            $scope.originConcept = {
                notation: concept.notation ? concept.notation : "",
                uri: concept.uri ? concept.uri : concept.notation,
                prefLabel: concept.prefLabel ? concept.prefLabel : "",
            };
        }else if(concept.label){
            $scope.originConcept = {
                notation: concept.notation ? concept.notation : "",
                uri: concept.uri ? concept.uri : concept.notation,
                prefLabel: concept.label
            };
        }else{
            $scope.originConcept = {
                notation: concept.notation ? concept.notation : "",
                uri: concept.uri ? concept.uri : concept.notation,
            };
        }
        $scope.selectOriginSubject($scope.originConcept);
    };
        
    $scope.reselectTargetConcept = function(concept){
        if(concept.prefLabel){
            $scope.targetConcept = {
                notation: concept.notation ? concept.notation : "",
                uri: concept.uri ? concept.uri : concept.notation,
                prefLabel: concept.prefLabel
            };
        }else if(concept.label){
            $scope.targetConcept = {
                notation: concept.notation ? concept.notation : "",
                uri: concept.uri ? concept.uri : concept.notation,
                prefLabel: concept.label
            };
        }else{
            $scope.targetConcept = {
                notation: concept.notation ? concept.notation : "",
                uri: concept.uri ? concept.uri : concept.notation,
            };
        }
        $scope.selectTargetSubject($scope.targetConcept);
    };
}]);

cocoda.run(function($rootScope,$http) {

    // load placeholder samples
    var placeholders = {
        'data/gnd-rvk.json': 'mappingSample',
        'data/gnd-ddc.json': 'mappingSampleGND',
        'data/ddc-gnd.json': 'mappingSampleNew',
        'data/ddc-rvk.json': 'mappingSampleDDCRVK',
        'data/ddc-all.json': 'mappingSampleDDC',
        'data/occurrences-1.json': 'occurrencesSample',
        'data/tree-1.json': 'treeSample',
        'data/rvk-suggestions-1.json': 'rvkSuggestions'
    };

    angular.forEach(placeholders, function(name, file) {
        $rootScope[name] = {};
        $http.get(file).success(function(data){
            $rootScope[name] = data;
        });
    });

    $rootScope.ddcTopConcepts = { values: [] };
    $http.get('data/ddc/topConcepts.json').success(function(data){
        $rootScope.ddcTopConcepts = { values: data };
    });
    $rootScope.searchSample = {
        // TODO
    };

});

cocoda.config(function($locationProvider, $compileProvider) {
    $locationProvider.html5Mode(true);
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|blob:http):/);
});
