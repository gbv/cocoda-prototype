function wikidataScheme(OpenSearchSuggestions, SkosConceptProvider, SkosConceptListProvider) {
    return {
        name: 'Wikidata',
        // look up a wikidata item by notation
        getConcept: new SkosConceptProvider({
            url: "http://www.wikidata.org/w/api.php?" + [
                    "action=wbgetentities",
                    "ids={notation}",
                    "props=info|labels|descriptions|aliases",
                    "format=json"
                ].join('&'),
            jsonp: true,
            transform: function(item) {
                var entity;
                if (angular.isObject(item.entities)) {
                    angular.forEach(item.entities, function(value, key) {
                        if (key == value.title) {
                            entity = value;
                        }
                    });
                }
                if (!entity) return { };
                
                var concept = {
                    uri: "http://wikidata.org/wiki/"+entity.title,
                    notation: [entity.title],
                    prefLabel: { },
                    altLabel: { },
                    note: { }
                };

                angular.forEach(entity.labels, function(s,language) {
                    concept.prefLabel[language] = s.value;
                });

                angular.forEach(entity.aliases, function(s,language) {
                    concept.altLabel[language] = s.map(function(v) {
                        return v.value;
                    });
                });

                angular.forEach(entity.descriptions, function(s,language) {
                    concept.note[language] = [s.value];
                });

                //console.log(concept);

                return concept;
            }
        })

    };
}
