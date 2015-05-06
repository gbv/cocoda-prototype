function ddcConceptScheme($q, SkosConceptSource, OpenSearchSuggestions) {
    var ddcProvider = new SkosConceptSource({
        url:"http://esx-151.gbv.de/?view=notation&key={notation}&exact=true",
        transform: function(item){
            var concept = {
                notation: [],
                prefLabel: {},
                broader: [],
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
    });
    var getNarrower = new SkosConceptSource({
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
    });
    var byNotation = function(notation) {
        var concept = { notation: [notation] };
        var temp = {};

        var deferred = $q.defer();
        // first get & update concept
        var promise = ddcProvider.updateConcept(concept);
        promise.then(function(){
            angular.copy(concept.broader[0], temp);
            ddcProvider.updateConcept(temp).then(function(){
                angular.copy(temp, concept.broader);
            }).then(function(){
                angular.copy(concept, temp);
                getNarrower(temp).then(function(){
                    angular.copy(temp, concept.narrower);
                    deffered.resolve(concept);
                })
            })
        });
        // promise the final result
        return deferred.promise;
    };
    var suggest = new OpenSearchSuggestions({
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
    });
    return {
        lookupURI: null,
        lookupNotation: byNotation,
        lookupLabel: null,
        suggest: suggest,
        getTopConcepts: null,
    };
}