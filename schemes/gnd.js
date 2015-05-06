function gndConceptScheme($q, SkosConceptSource, OpenSearchSuggestions) {
    var gndProvider = new SkosConceptSource({
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
    });
    var byNotation = function(notation) {
        var concept = { notation: [notation] };
        var temp = {};

        var deferred = $q.defer();
        // first get & update concept
        var promise = ddcProvider.updateConcept(concept);
        promise.then(function(){
            ddcProvider.updateConnected(concept);
            deffered.resolve(concept);
        });
    };
    var suggest = new OpenSearchSuggestions({
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
    return {
        lookupURI: null,
        lookupNotation: byNotation,
        lookupLabel: null,
        getTopConcepts: null,
        suggest: suggest,
    };
}