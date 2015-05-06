var cocoda = angular.module('Cocoda', ['ngSKOS','ui.bootstrap','ngSuggest']);

/**
 * Controller
 */
cocoda.controller('myController',[
    '$rootScope','$scope','$http','$q','SkosConceptSource','OpenSearchSuggestions','SkosHTTP',
    function ($rootScope, $scope, $http, $q, SkosConceptSource, OpenSearchSuggestions, SkosHTTP){
    
    $scope.schemes = ['ddc','gnd','rvk'];
    // references to the http-calls
    var rvk = rvkConceptScheme(
        $q,
        SkosConceptSource, OpenSearchSuggestions, SkosHTTP
    );
    $scope.rvk = rvk;
    var ddc = ddcConceptScheme(
        $q,
        SkosConceptSource, OpenSearchSuggestions, SkosHTTP
    );
    $scope.ddc = ddc;
    var gnd = rvkConceptScheme(
        $q,
        SkosConceptSource, OpenSearchSuggestions, SkosHTTP
    );
    $scope.gnd = gnd;
    

    // NG-SUGGEST & NAVBAR FUNCTIONALITY
    $scope.showTargetSearch = false;
    $scope.showOriginSearch = true;
    // possible profile scope
    

    $scope.loggedIn = false;

    // active source and target schemes
    $scope.activeView = {
        origin: 'ddc',
        target: 'rvk'
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
        mappingType: '',
        mappingRelevance: '',
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
    $scope.SaveMappingURL = ""; // TODO: Change URL to new DB
    $scope.SaveCurrentMapping = function() {
        if($scope.loggedIn === true){
            $scope.currentMapping.source = "VZG";
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
    // local saving of mappings
    $scope.expandJSON = false;
    $scope.blob = "";
    $scope.saveLocally = function(){
        var type = "text/javascript";
        var object = JSON.stringify($scope.currentMapping);
        $scope.blob = new Blob([object], { type: type });
        var filename = $scope.currentMapping.from.conceptSet[0].inScheme.notation[0];
        filename += "_" + $scope.currentMapping.from.conceptSet[0].notation[0];
        $scope.saveHREF = window.URL.createObjectURL($scope.blob);
        $scope.saveDataURL = [ type, filename, $scope.saveHREF ].join(':');
        $scope.expandJSON = true;
    }
    $scope.hideJSON = function(){
        $scope.expandJSON = false;
    }
    $scope.cleanUp = function(){
        setTimeout(function(){
            window.URL.revokeObjectURL($scope.saveHREF);
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
            if(mr == 0.2){ // TODO: remove conversion of specific types
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
    $scope.requestMappings = function(target){  // TODO: remove static samples
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
    $scope.topOriginConcept = "";
    $scope.topTargetConcept = "";
    // TOP CONCEPTS
    $scope.changeTopOrigin = function(scheme){
        if(scheme == 'rvk'){
            rvk.getTopConcepts.then(function(response){
                $scope.topOriginConcept = response;
            });
        }else if(scheme == 'ddc'){ // TODO: Retrieve dynamically
            $scope.topOriginConcept = angular.copy($scope.ddcTopConcepts);  
        }else{
            $scope.topOriginConcept = "";
        }
    }
    $scope.changeTopTarget = function(scheme){
        if(scheme == 'rvk'){
            rvk.getTopConcepts.then(function(response){
                $scope.topTargetConcept = response;
            });
        }else if(scheme == 'ddc'){ // TODO: Retrieve dynamically
            $scope.topTargetConcept = angular.copy($scope.ddcTopConcepts);  
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
        if($scope.originConcept.notation[0] == "612.112" && $scope.activeView.origin == "DDC"){ // TODO remove exception
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
    $scope.selectedOriginConcept = {
        notation: [] ,
        uri: "",
        prefLabel: {
            de:""
        },
        broader:"",
    };
    $scope.selectedTargetConcept = {
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
        [$scope.activeView.origin].lookupNotation(concept.notation[0]).then(function(response){
            angular.copy(response, $scope.selectedOriginConcept);
        });
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
        [$scope.activeView.target].lookupNotation(concept.notation[0]).then(function(response){
            angular.copy(response, $scope.selectedTargetConcept);
        });
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
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|blob:http)(:|%3A)/);
});
