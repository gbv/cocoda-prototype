/**
 * @ngdoc overview
 * @name json-text
 * @module json-text
 * @description
 *
 * This utility module provides directive {@link json-text.directive:jsonText 
 * jsonText} for directly displaying or editing JSON objects as text strings.
 */

angular.module('jsonText',[])
/**
 * @ngdoc directive
 * @name json-text.directive:jsonText
 * @restrict AE
 * @param {string} ngModel angular expression to bind to.
 * @description
 *
 * This directive can be used to display or edit an object in JSON syntax:
 *
 * <code>
 * <pre><textarea json-text ng-model="myObject"/></pre>
 * </code>
 */
.directive('jsonText',function(){
    return {
        restrict: 'AE',
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
            function fromJson(text) {
                return angular.fromJson(text);
            }
            function toJson(object) {
                return angular.toJson(object, true);
            }
            ngModel.$parsers.push(fromJson);
            ngModel.$formatters.push(toJson);
            scope.$watch(attrs.ngModel, function(newValue, oldValue) {
                if (newValue != oldValue) {
                    ngModel.$setViewValue(toJson(newValue));
                    ngModel.$render();
                }
            }, true);
        }
    };
});

