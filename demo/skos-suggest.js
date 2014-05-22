var Demo = angular.module('myApp', ['ngSKOS','ui.bootstrap','ngSuggest']);
Demo.run(function($rootScope,$http) {
    $rootScope.sampleConcept = {};
    $http.get('data/rvk/UN.json').success(function(data){
        $rootScope.sampleConcept = data;
    });
});
Demo.config(function($locationProvider) {
          $locationProvider.html5Mode(true);
        }).controller('MainCtrl', function ($scope, $location) { });
        
function myController($rootScope){
    $rootScope.example = {api: "http://ws.gbv.de/suggest/gnd/index.php?count=10&type=&searchterm="}
    $rootScope.example.input = "";
    $rootScope.example.onSelect = selectFunction();
    
    function selectFunction() {
        return function (item) {
            $rootScope.example.item = item;
        }
    }
}