/**
 * @ngdoc service
 * @name ng-skos.service:SkosProvider
 * @description
 * 
 * Utility service to facilitate HTTP requests. 
 *
 * This service implements use of URL templates to perform HTTP requests with 
 * optional transformation of JSON responses and error handling. Directly use
 * [SkosConceptProvider](#/api/ng-skos.service:SkosConceptProvider) and
 * [SkosConceptListProvider](#/api/ng-skos.service:SkosConceptListProvider)
 * instead.
 * 
 * ## Configuration
 * 
 * * **`url`**: URL template for requests
 * * **`jsonp`**: enable JSONP
 * * **`transform`**: custom transformation function to map expected response format
 *
 * ## Methods
 *
 * * **`get([url])`**: perform a HTTP request
 *
 */
angular.module('ngSKOS')
.factory('SkosProvider',['$http','$q',function($http,$q) {

    // constructor
    var SkosProvider = function(args) {
        if (!args) { args = {}; }
        this.transform = args.transform;
        this.url = args.url;
        var jsonp = args.jsonp;
        if (jsonp && (jsonp === true || angular.isNumber(jsonp) || jsonp.match(/^\d/))) {
            jsonp = 'callback';
        }
        this.jsonp = jsonp;
    };

    SkosProvider.prototype = {
        get: function(url) {
            if (!url) {
                url = this.url;
            }

            var transform = this.transform;

            var get = $http.get;
            if (this.jsonp) {
                get = $http.jsonp;
                url += url.indexOf('?') == -1 ? '?' : '&';
                url += this.jsonp + '=JSON_CALLBACK';
            }

            return get(url).then(
                function(response) {
                    try {
                        return transform ? transform(response.data) : response.data;
                    } catch(e) {
                        console.error(e);
                        return $q.reject(e);
                    }
                }, function(response) {
                    console.error(response);
                    return $q.reject(response.data);
                }
            );
        }
    };

    return SkosProvider;
}]);
