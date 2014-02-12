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
        $scope.currentTerminology = CocodaTerminology.get(terminology);
    };

}

// defines <cocoda-conceptlist>
myApp.directive('cocodaConceptlist', function() {
    return {
        restrict: 'E',
        scope: {
            title: '=',
            concepts: '=',
        },
        templateUrl: "templates/conceptlist.html",
        controller: function($scope) {
            // TODO: browsing in the list
        }
    };
});

// defines <cocoda-conceptsearch>
myApp.directive('cocodaConceptsearch', function() {
    return {
        restrict: 'E',
        scope: {
            title: '=',
            terminology: '=',
            result: '=',
        },
        templateUrl: "templates/conceptsearch.html",
        controller: function($scope, CocodaTerminology) {
            $scope.search = function() {
                console.log("search: " + $scope.query);
                $scope.result = CocodaTerminology.search(
                    $scope.terminology,
                    $scope.query
                );
            };
        }
    };
});

