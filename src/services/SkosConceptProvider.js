/**
 * @ngdoc service
 * @name ng-skos.service:SkosConceptProvider
 * @description
 * 
 * Get concepts via HTTP. 
 *
 * The server to be queried with this service is expected to return a JSON
 * object with one [concept](#/guide/concepts). The concept object may contain
 * links to narrower and broader concepts, among other information.
 * 
 * ## Configuration
 * 
 * * **`url`**: URL template for requests
 * * **`jsonp`**: enable JSONP
 * * **`transform`**: custom transformation function to map expected response format
 *
 * ## Methods
 *
 * * **`getConcept(concept)`**
 * * **`updateConcept(concept)`**
 * * **`updateConnected(concept)`**
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
.factory('SkosConceptProvider',['SkosProvider',function(SkosProvider) {

    // inherit from SkosProvider
    var SkosConceptProvider = function(args) {
        SkosProvider.call(this, args);
    };
    SkosConceptProvider.prototype = new SkosProvider();
    
    SkosConceptProvider.prototype.getConcept = function(concept) {
        var url;
        // look up by uri / notation / prefLabel
        if (this.url) {
            if (angular.isFunction(this.url)) {
                url = this.url(concept);
            } else {
                url = this.url;
                if (concept.notation) {
                    var notation = concept.notation[0];
                    url = url.replace('{notation}', decodeURIComponent(notation));
                }
                url = url.replace('{uri}', decodeURIComponent(concept.uri));
            }
        } else {
            url = concept.uri;
        }

        return this.get(url);
    };
    
    SkosConceptProvider.prototype.updateConcept = function(concept) {
        return this.getConcept(concept).then(
            function(response) {
                angular.copy(response, concept);
            }
        );
    };

    SkosConceptProvider.prototype.updateConnected = function(concept, which) {
        if (angular.isString(which)) {
            which = [which];
        } else if (!angular.isArray(which)) {
            which = ['broader','narrower','related'];
        }
        var service = this;
        angular.forEach(which, function(w) {
            angular.forEach(concept[w], function(c){
                service.updateConcept(c);
            });
        });
    };
 
    return SkosConceptProvider;
}]);
