var myApp = angular.module('myApp',['Cocoda','ui.bootstrap']);

function CocodaAppController($scope, CocodaServer, CocodaTerminology) {

    $scope.api = '/api';

    // get basic data from Cocoda Server (TODO: error handling)
    CocodaServer.about($scope.api).then(function(provider){
        $scope.title   = provider.title;
        $scope.version = provider.version;
        return provider.services;
    }).then(function(services) {
        if (services.terminologies) {
            CocodaServer.terminologies(services.terminologies)
            .then(function(terminologies){
                $scope.terminologies = terminologies;
                if (!$scope.currentTerminology) {
                    $scope.currentTerminology = terminologies[0];
                }
            });
        }
        // TODO: mappings and ocurrences
    });

    $scope.selectTerminology = function(terminology) {
        $scope.currentTerminology = terminology;
        CocodaTerminology.about(terminology).then(function(about) {
            $scope.topConcepts = about.topConcepts;
        });
    }

    $scope.searchTerminology = function() {
        var query = $scope.searchInTerminology;
        CocodaTerminology.search(
            $scope.currentTerminology,
            query
        ).then(function(result){
            $scope.searchResult = result;
        });
    }
}

// defines <conceptlist>
myApp.directive('conceptlist', function() {
    return {
        restrict:'E',
        scope: {
            title: '=title',
            concepts: '=concepts',
        },
        templateUrl: "conceptlist.html",
        controller: function($scope) {
            // how to interact, e.g. on clicks
        }
    };
});

