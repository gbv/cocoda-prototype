/**
 * @ngdoc directive
 * @name ng-skos.directive:skosConcept
 * @restrict AE
 * @scope
 * @description
 * 
 * Display a concept with a custom template.
 *
 * The following variables are added to the scope:
 * <ul>
 * <li>ancestors (array of concepts)
 * <li>prefLabel (object of strings)
 * <li>altLabel (object of array of strings)
 * <li>notation (string)
 * <li>note (object of array of strings)
 * <li>broader (array of concepts)
 * <li>narrower (array of concepts)
 * <li>related (array of concepts)
 * </ul>
 *
 * @param {object} concept the concept to display
 */
ngSKOS.directive('skosConcept', function() {
    return {
        restrict: 'AE',
        scope: { concept: '=' },
        transclude: 'element',
        template: '',
        link: function link($scope, element, attrs, controller, transclude) {

//            attrs.skosConcept;

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
                    element.append(clone);
                }
            );
        }
    }
});
