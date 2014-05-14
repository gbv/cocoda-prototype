/**
 * @ngdoc directive
 * @name ng-skos.directive:skosConcept
 * @restrict A
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
 * @param {string} skos-concept Assignable angular expression with 
 *      [concept](#/guide/concepts) data to bind to.
 * @param {string} language Assignable angular expression with 
 *      preferred language to be used as bounded `language` variable. 
 *
 * @example
 *
 */
ngSKOS.directive('skosConcept', function() {
    return {
        restrict: 'A',
        scope: { 
            concept: '=skosConcept',
            language: '=language',
        },
        templateUrl: function(element, attrs) {
            // TODO: use default if not specified
            return attrs.templateUrl; 
        },
        link: function link($scope, element, attr, controller, transclude) {

            $scope.update = function(concept) {
                if (concept) {
                    $scope.concept = concept;
                }
                // TODO: choose prefLabel by language attribute (?)
                angular.forEach(
                    ['uri','inScheme','ancestors','prefLabel','altLabel','note','notation','narrower','broader','related'],
                    function(field) { 
                        $scope[field] = $scope.concept[field];
                        // TODO: add watcher/trigger
                    }
                );
            };
            // TODO: (re)load concept from server to get current details
            $scope.reload = function() { };

            $scope.update();
        }
    }
});
