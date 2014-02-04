/**
 * cocoda.js - AngularJS module to interact with a Cocoda server
 *
 * This AngularJS module provides services to interact with a Cocoda server.
 *
 * @author: Jakob Voß <voss@gbv.de>
 */

(function() {

var Cocoda = angular.module('Cocoda',['ngResource']);

// TODO: move into module
function parseURLTemplate(url) {
    var template = url.match(/(.+){\?(.+)}$/);
    if (template) {
        return {
            base: template[1],
            query: template[2].split(',').reduce(
                function(o,k){o[k]=k;return o;},{}
            )
        }
    } else {
        return { 
            base: url, 
            query: { }
        };
    }
}

function expandCocodaResource(obj) {
    for (var key in obj) {
        if (obj[key] !== null && typeof(obj[key])=="object") {
            expandCocodaResource(obj[key]);
        } else if (key == 'url') {
            obj['url'] = parseURLTemplate(obj['url'])
        }
    }
}

// use $resource with transformResponse instead of $http

// Service to query basic information from a Cocoda server
Cocoda.factory('CocodaServer',function($http){
    return {
        about: function(url) {
            return $http.get(url)
                .then(function(response){
                    expandCocodaResource(response.data);
                    return response.data.provider;
                });
        },
        // list terminologies
        terminologies: function(url) {
            return $http.get(url).then(function(response){
                    expandCocodaResource(response.data);
                    return response.data.terminologies;
                });
        },
        // list mappings
        mappings: function() {
            // TODO
        }
    };
});

// Service to query a Cocoda terminology server
Cocoda.factory('CocodaTerminology',['$resource',function($resource){
    return {
        // get terminology, including top concepts
        get: function(terminology) {
            return $resource(terminology.url.base).get({},
                function(data){
                    expandCocodaResource(data);
                });
        },
        // look up a concept
        // TODO: URL template, such as
        // http://example.org/my-terminology/{notation}{?search}
        // concept: function(terminology, conceptId) {
            // ...
        // },
        // search for concepts
        search: function(terminology, query) {
            return $resource( terminology.url.base ).get( { search: query },
                function(data){
                    expandCocodaResource(data);
                });
        },
    };
}]);

// Service to read and write mappings
Cocoda.factory('CocodaMapping',['$resource',function($resource){
    return {
        // TODO
    };
}]);

}).call(this);
