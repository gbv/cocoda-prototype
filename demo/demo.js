var cocodaDemo = angular.module('cocodaDemo', ['ngSKOS','jsonText','ui.bootstrap']);
cocodaDemo.run(function($rootScope,$http) {
    $rootScope.sampleConcept = {};
    $http.get('data/concept-1.json').success(function(data){
        $rootScope.sampleConcept = data;
    });
    $rootScope.searchSample = {
        // ...
    };

    $rootScope.mappingSample = {};
    $http.get('data/mapping-1.json').success(function(data){
        $rootScope.mappingSample = data;
		});
		$rootScope.occurrencesSample = {};
    $http.get('data/occurrences-1.json').success(function(data){
        $rootScope.occurrencesSample = data;
		});
    $rootScope.treeSample = {};
		$http.get('data/tree-1.json').success(function(data){
        $rootScope.treeSample = data;
		});
});
cocodaDemo.config(function($locationProvider) {
          $locationProvider.html5Mode(true);
        }).controller('MainCtrl', function ($scope, $location) { });