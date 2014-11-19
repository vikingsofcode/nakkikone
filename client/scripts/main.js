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

app.factory('loginService', ['$resource', function ($resource) {
  var api = $resource(null, {id: '@id'}, {
    checkAuth: {
      method: 'GET',
      url: '/api/weiner'
    }
  });
  return api;
}]);


app.controller('frontController', ['$scope', '$resource', '$http', '$routeParams', '$route', '$q', '$location', 'loginService', function($scope, $resource, $http, $routeParams, $route, $q, $location, loginService) {
  $scope.check = "It works, it works!";
  $scope.getAuthPromise = loginService.checkAuth().$promise;

  $scope.getAuthPromise.then(function(result) {
    if(result.userId) {
      $scope.auth = result;
      $location.path('/weiner');
    } else {
      $scope.auth = result;
      $location.path('/');
    }
  });

}]);

app.controller('weinerController', ['$scope', '$resource', '$http', '$routeParams', '$route', '$q', '$location', 'loginService', function($scope, $resource, $http, $routeParams, $route, $q, $location, loginService) {
  $scope.check = "weiner";
  
  $scope.getAuthPromise = loginService.checkAuth().$promise;
  $scope.getAuthPromise.then(function(result) {
    if(!result.userId) {
      $location.path('/');
    }
    $scope.user = result;
    $scope.nakki = {
      username: $scope.user.username,
      text: ''
    };
  });
  

  $scope.weiners = [];

  $scope.addWeiner = function(nakki) {
    $scope.weiners.push(nakki);
    $scope.nakki = {username: $scope.user.username, text: ''};
  };


}]);
