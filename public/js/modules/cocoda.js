/**
 * cocoda.js - AngularJS module to interact with a Cocoda server
 *
 * This AngularJS module provides services to interact with a Cocoda server.
 *
 * @author: Jakob Voß <voss@gbv.de>
 */

(function() {

var Cocoda = angular.module('Cocoda',[]);

// Service to query basic information from a Cocoda server
Cocoda.factory('CocodaServer',function($http){
    return {
        apiBase: null,
        about: function() {
            return $http.get(this.apiBase/*,{cache:true}*/)
                .then(function(response){
                    return response.data;
                });
        },
    };
});

// Service to query a Cocoda terminology server
Cocoda.factory('CocodaTerminology',function($http){
    return {
        apiBase: null,
        // list available terminologies
        list: function() {
            return $http.get(this.apiBase/*,{cache:true}*/)
                .then(function(response){
                    var terminologies = [];
                    for(var key in response.data) {
                        terminologies.push(response.data[key]);
                    }
                    return terminologies;
                });
        },
        // get top concepts
        about: function(terminologyKey) {
            return $http.get(this.apiBase + '/' + terminologyKey)
                .then(function(response){
                    return response.data;
                });
        },
        // look up a concept
        concept: function(terminologyKey, conceptId) {
            // ...
        },
        // search for concepts
        search: function(terminologyKey, query) {
            var url = this.apiBase + '/' + terminologyKey;
            return $http({ url: url, method: "GET", params: { search: query } })
                .then(function(response){
                    return response.data.result;
                });
        },
    };
});

// Service to read and write mappings
Cocoda.factory('CocodaMapping',function($http){
    return {
        apiBase: null,
        // ...
    };
});

// ...

}).call(this);
