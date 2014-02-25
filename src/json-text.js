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
 *
 * @param {string} json-valid AngularJS expression to bind parsing status to.
 *
 * @example 
 <example module="myApp">
  <file name="index.html">
    <div ng-controller="myController">
      valid: {{jsonOk}}
      <pre>{{data | json}}</pre>
      <textarea json-text ng-model="data" json-valid="jsonOk" style="width:100%" rows="12"></textarea>
    </div>
  </file>
  <file name="script.js">
    angular.module('myApp',['ngSKOS','jsonText']);

    function myController($scope) {
        $scope.data = {
            foo: [32, 42],
            bar: { 
                doz: true,
            },
        };
    }
  </file>
</example>
*/
.directive('jsonText',function(){
    return {
        restrict: 'AE',
        require: 'ngModel',
        scope: { jsonValid: '=' },
        link: function(scope, element, attrs, ngModel) {
            scope.jsonValid = true;
            function fromJson(text) {
                try {
                    scope.jsonValid = true;
                   return angular.fromJson(text);
                } catch(e) {
                    scope.jsonValid = false;
                }
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

