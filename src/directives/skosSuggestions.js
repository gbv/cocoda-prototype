/**
 * @ngdoc directive
 * @name ng-skos.directive:skosSuggestions
 * @restrict A
 * @description
 *
 * ...
 *
 * @param {string} skos-suggestions ...
 * @param {string} template-url URL of a template to display the suggestions
 *
 * @example
 <example module="myApp">
  <file name="index.html">
    <div ng-controller="myController">
      ...
    </div>
  </file>
  <file name="script.js">
    angular.module('myApp',['ngSKOS']);

    function myController($scope) {
        // ...
    }
  </file>
</example>
 */
angular.module('ngSKOS')
.directive('skosSuggestions', function() {
    return {
        restrict: 'A',
        scope: {
            concepts:'=skosSuggestions',
            select:'=selectSuggestion',
            lookup: '=lookUpSuggestion',
            lang: '=language'
        },
        templateUrl: function(elem, attrs) {
            return attrs.templateUrl ? 
                   attrs.templateUrl : 'src/templates/skos-suggestions.html';
        },
        link: function link(scope, element, attr, controller, transclude) {
            scope.$watch('lang', function(lang){
                scope.popOverTitle = function(label){
                    if(label[lang]){
                        return label[lang];
                    }else{
                        for(lang in label){
                            return label[lang];
                        }
                    }
                }
            });
            scope.remove = function(index) { 
                scope.concepts.splice(index, 1);
            };
            scope.selectAll = function(concepts) {
                angular.forEach(concepts, function(c){
                    scope.select(c);
                })
            }
        },
        controller: function($scope){
            $scope.status = {open: true};
        }
    };
});
