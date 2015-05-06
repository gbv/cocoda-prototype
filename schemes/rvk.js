function rvkConceptScheme($q, SkosConceptSource, SkosHTTP, OpenSearchSuggestions) {

    function transformNode(node) {
        return {
            prefLabel: { de: node.benennung },
            notation: [ node.notation ],
            narrower: (node.has_children == "yes"),
        };
    };

    var rvkProvider = new SkosConceptSource({
        //url:'data/rvk/{notation}.json',
        //jsonp: false,

        // TODO: look up narrower
        url: "http://rvk.uni-regensburg.de/api/json/node/{notation}",
        transform: function(item) {
            // TODO: use TransformNode
            var concept = {
                notation: [ item.node.notation ],
                uri: item.node.notation,
                prefLabel: { de: item.node.benennung },
                narrower: false
            };

            var register = item.node.register;
            if (angular.isArray(register)) {
                concept.altLabel = { de: register };
            } else if (angular.isString(register)) {
                concept.altLabel = { de: [register] };
            }

            if (item.node.has_children == 'yes'){
                concept.narrower = true;
            }

            return concept;
        },
        jsonp: 'jsonp'
    });

    // get all direct children of the concept
    // TODO: cleanup this code
    var getNarrower = new SkosConceptSource({
        url: "http://rvk.uni-regensburg.de/api/json/children/{notation}",
        transform: function(item) {
            var node = item.node;
            if(!node) return;

            var concept = {
                notation: [ node.notation ],
                uri: node.notation,
                prefLabel: { de: node.benennung },
                narrower: [],
                broader: [],
            };
            if(!node.nochildren){
                if(angular.isArray(node.children.node)){
                    angular.forEach(node.children.node, function(nterm) {
                        concept.narrower.push({
                            uri: nterm.notation,
                            prefLabel: { de: nterm.benennung },
                            notation: [ nterm.notation ]
                        });
                    });
                } else if(angular.isString(node.children.node)){
                    concept.narrower = [
                        {
                            uri: node.children.node.notation,
                            prefLabel: { de: node.children.node.benennung },
                            notation: [ node.children.node.notation ]
                        }
                    ];
                }
            }
            return concept;
        },
        jsonp: 'jsonp'
    });

    // get the direct ancestor of the concept
    var getBroader = new SkosConceptSource({
        url: "http://rvk.uni-regensburg.de/api/json/ancestors/{notation}",
        transform: function(item) {
            var node = item.node;
            if(!node) return;

            var concept = { 
                notation: [ node.notation ],
                uri: node.notation,
                prefLabel: { de: node.benennung },
                broader: [],
            };
            if (node.ancestor){
                concept.broader.push({
                    notation: [ node.ancestor.node.notation ],
                    uri: node.ancestor.node.notation,
                    prefLabel: { de: node.ancestor.node.benennung }
                })
            }
            return concept;
        },
        jsonp: 'jsonp'
    });
 

    var byNotation = function(notation) {
        var concept = { notation: [notation] };
        var temp = {};

        var deferred = $q.defer();
        // first get & update concept
        var promise = rvkProvider.updateConcept(concept);
        promise.then(function(){
            angular.copy(concept, temp);
            // then get children & ancestors
            if (concept.narrower === true) {
                getNarrower.updateConcept(concept).then(function(){
                    angular.copy(temp.altLabel, concept.altLabel);
                    getBroader.updateConcept(temp).then(function(){
                        angular.copy(temp.broader, concept.broader);
                        deferred.resolve(concept);
                    });
                });
            } else {
                getBroader.updateConcept(concept).then(function(){
                    angular.copy(temp.altLabel, concept.altLabel);
                    deferred.resolve(concept);
                });
            }
        });
        // promise the final result
        return deferred.promise;
    };

    // expected to promise an array of JSKOS
    // [concept](http://gbv.github.io/jskos/jskos.html#concepts)
    var getTopConcepts = function() {
        var provider = new SkosHTTP({
            url: "http://rvk.uni-regensburg.de/api/json/children",
            jsonp: 'jsonp',
            transform: function(response) { 
                return response.node.children.node.map(transformNode);
            },
        });
        return provider.get();
    };

    var suggest = new OpenSearchSuggestions({
        url: 'http://rvk.uni-regensburg.de/api/json/nodes/{searchTerms}',
        jsonp: 'jsonp',
        transform: function(response) { 
            return {
                values: response.node.map(function(node) {
                    return {
                        label: node.benennung,
                        description: node.notation
                    };
                })
            };
        },
        jsonp: 'jsonp'
    });

    return {
        lookupURI: null,
        lookupNotation: byNotation,
        lookupLabel: null,
        getTopConcepts: getTopConcepts,
        suggest: suggest,
    };
}
