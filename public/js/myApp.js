var myApp = angular.module('myApp', []);
 
function loadTerminologies(url, $scope, $http) {
    $http.get(url).success(function(response) {
        $scope.terminologies = [];
        for(var key in response) {
            if (!$scope.currentTerminology) {
                $scope.currentTerminology = response[key];
            }
            $scope.terminologies.push(response[key]);
        }
        $scope.selectTerminology = function(terminology) {
            $scope.currentTerminology = terminology;
        }
    });
}

myApp.controller('CocodaServer',function($scope, $http) {
    var apiBase = '/';
    $scope.api = apiBase;
    $http.get(apiBase)
        .success(function(response){
            $scope.title = response.title;
            $scope.version = response.version;
            if (response.terminologies) {
                loadTerminologies(response.terminologies, $scope, $http);
            }
        }).error(function(err){  });

    // TODO: use a service instead
    $scope.searchTerminology = function() {
        var query = $scope.searchInTerminology;
        var url = $scope.currentTerminology.url;
        $http({ url: url, method: "GET", params: { search: query } })
            .success(function(response){
                console.log(response);
                // TODO: response.result contains results
            });
    };
});
