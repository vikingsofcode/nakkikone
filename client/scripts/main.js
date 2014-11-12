require('angular');
require('angular-route');
require('angular-resource');
require('angular-animate');
var views = '/views/';

angular.module('nakkikone', ['ngRoute', 'ngResource', 'ngAnimate', 'weiner']);

var app = angular.module('weiner', []);

app.config(['$routeProvider', '$locationProvider', '$httpProvider', function($routeProvider, $locationProvider, $httpProvider) {
  $routeProvider
    .when('/', {
      templateUrl: views + 'front',
      controller:  'frontController'
    })
    .when('/weiner', {
      templateUrl: views + 'weiner',
      controller: 'weinerController'
    });
  
  // $locationProvider.html5Mode(true);
}]);

app.controller('frontController', ['$scope', '$resource', '$http', '$routeParams', '$route', '$q', '$location', function($scope, $resource, $http, $routeParams, $route, $q, $location) {
  $scope.check = "It works, it works!";

}]);

app.controller('weinerController', ['$scope', '$resource', '$http', '$routeParams', '$route', '$q', '$location', function($scope, $resource, $http, $routeParams, $route, $q, $location) {
  $scope.check = "weiner";
  $scope.nakki = {
    username: 'Nakkipate',
    text: 'nakki'
  };
  $scope.weiners = [];
  $scope.addWeiner = function(nakki) {
    $scope.weiners.push(nakki);
    $scope.nakki = {username: 'Nakkipate', text: ''};
  };

}]);
