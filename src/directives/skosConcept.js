// requires AngularJS >= 1.2
// Display a concept (skos:Concept) with custom template having following variables
// - ancestors (array of concepts)
// - prefLabel (object of strings)
// - altLabel (object of array of strings)
// - notation (string)
// - note (object of array of strings)
// - broader ...
// - narrower ...
// - related ...
ngSKOS.directive('skosConcept', function() {
    return {
        restrict: 'EA',
        scope: { concept: '=' },
        transclude: 'element',
        template: '',
        link: function link($scope, element, attrs, controller, transclude) {
            $scope.update = function(concept) {
                if (concept) {
                    $scope.concept = concept;
                }
                // TODO: choose prefLabel by language attribute
                // TODO: replace ancestors with list of ancestors
                angular.forEach(
                    ['ancestors','prefLabel','altLabel','notation','narrower','broader','related'],
                    function(field) { 
                        $scope[field] = $scope.concept[field]; 
                        // TODO: add watcher/trigger
                    }
                ); 
            };
            
            // TODO: (re)load concept from server to get current details
            $scope.reload = function() { };

            $scope.update();

            transclude($scope,
                function(clone) {
                    element.after(clone);
                }
            );
        }
    }
});
