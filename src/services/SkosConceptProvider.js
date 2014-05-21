/**
 * @ngdoc service
 * @name ng-skos.service:SkosConceptProvider
 * @description
 * 
 * Get concepts via HTTP.
 * 
 * ## Methods
 *
 * * getConcept
 * * updateConcept
 *
 * @example
 *  <example module="myApp">
 *    <file name="index.html">
 *      <div ng-controller="myController">
 *      </div>
 *    </file>
 *    <file name="script.js">
 *      angular.module('myApp',['ngSKOS']);
 *      function myController($scope, SkosConceptProvider) {
 *          var foo = new SkosConceptProvider({
 *              url: '...'
 *          });
 *      }
 *    </file>
 *  </example>
 */
angular.module('ngSKOS')
.factory('SkosConceptProvider',['$http','$q',function($http,$q) {

    // constructor
    var SkosConceptProvider = function(args) {
        this.transform = args.transform;
        this.url = args.url;
        this.jsonp = (typeof args.jsonp === 'undefined' || args.jsonp === "")
                   ? true : !!args.jsonp;    
    };

    // methods
    SkosConceptProvider.prototype = {
        // look up by uri / notation / prefLabel
        getConcept: function(concept) {
            var url;

            if (this.url) {
                url = this.url;
                var notation = concept.notation[0];
                url = url.replace('{uri}', decodeURIComponent(concept.uri));
                url = url.replace('{notation}', decodeURIComponent(notation));
                // TODO: prefLabel
            } else {    
                url = concept.uri;
            }

            var transform = this.transform;

            // TODO: if jsonp
            var method = this.jsonp ? $http.jsonp : $http.get;

            return method(url).then(
                function(response) {
                    try {
                        return transform ? transform(response.data) : response.data;
                    } catch(e) {
                        return $q.reject(e);
                    }
                }, function(response) {
                    return $q.reject(response.data);
                }
            );
        },
        // FIXME
        updateConcept: function(concept) {
            return this.getConcept(concept).then(
                function(response) {
                    angular.copy(response, concept);
                }
            );
        }
    };
 
    return SkosConceptProvider;
}]);
