var myApp = angular.module('myApp',['Cocoda','ui.bootstrap']);

function CocodaAppController($scope, CocodaServer, CocodaTerminology) {

    $scope.api = CocodaServer.apiBase = '/api';

    // get basic data from Cocoda Server (TODO: error handling)
    CocodaServer.about().then(function(server){
        $scope.title   = server.title;
        $scope.version = server.version;
        return server.services;
    }).then(function(services) {
        CocodaTerminology.apiBase = services.terminologies;
        CocodaTerminology.list().then(function(terminologies){
            $scope.terminologies = terminologies;
            if (!$scope.currentTerminology) {
                $scope.currentTerminology = terminologies[0];
            }
        });
    });

    $scope.selectTerminology = function(terminology) {
        $scope.currentTerminology = terminology;
        CocodaTerminology.about(terminology.key).then(function(about) {
            $scope.topConcepts = about.top;
        });
    }


    $scope.searchTerminology = function() {
        var query = $scope.searchInTerminology;
        var key   = $scope.currentTerminology.key;

        CocodaTerminology.search(key,query).then(function(result){
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

