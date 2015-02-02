/**
 * @ngdoc service
 * @name ng-skos.service:SkosConceptListSource
 * @description
 * 
 * Get an ordered list of concepts via HTTP.
 *
 * The server to be queried with this service is expected to return a list with
 * [concept](#/guide/concepts) objects.
 * 
 * ## Configuration
 * 
 * * **`url`**: URL template to get the list from
 * * **`jsonp`**: enable JSONP
 * * **`transform`**: transformation function to map to expected response format
 *
 * ## Methods
 *
 * * **`getConceptList()`**
 * * **`updateConceptList(list)`**
 *
 */
angular.module('ngSKOS')
.factory('SkosConceptListSource',['SkosHTTP',function(SkosHTTP) {

    // inherit from SkosHTTP
    var SkosConceptListSource = function(args) {
        SkosHTTP.call(this, args);
    };
    SkosConceptListSource.prototype = new SkosHTTP();
    
    SkosConceptListSource.prototype.getConceptList = function() {
        return this.get();
    };
    
    SkosConceptListSource.prototype.updateConceptList = function() {
        return this.getConceptList(list).then(
            function(response) {
                angular.copy(response, list);
            }
        );
    };

    return SkosConceptListSource;
}]);
