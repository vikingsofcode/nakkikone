require('angular');
require('angular-route');
require('angular-resource');
// require('angular-animate');
window._ = require('lodash');
var views = 'views/';

angular.module('nakkikone', ['ngRoute', 'ngResource', 'weiner']);

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
    })
    .when('/weiner/my/profile', {
      templateUrl: views + 'profile',
      controller:  'profileController'
    })
    .when('/weiner/my/weiners', {
      templateUrl: views + 'weiners',
      controller:  'myWeinersController'
    })
    .when('/weiner/my/settings', {
      templateUrl: views + 'settings',
      controller:  'settingsController'
    });
  
  // $locationProvider.html5Mode(true);
}]);

app.factory('loginService', ['$resource', function ($resource) {
  var api = $resource(null, {id: '@id'}, {
    checkAuth: {
      method: 'GET',
      url: 'api/weiner'
    }
  });
  return api;
}]);

app.factory('userService', ['$resource', function ($resource) {
  var api = $resource(null, {id: '@id'}, {
    getUsers: {
      method: 'GET',
      url: 'api/users',
      isArray: true
    }
  });
  return api;
}]);

app.factory('weinerService', ['$resource', function ($resource) {
  var api = $resource(null, {id: '@id'}, {
    getWeiners: {
      method: 'GET',
      url: 'api/weiners',
      isArray: true
    },
    saveWeiner: {
      method: 'POST',
      url: 'api/weiners'
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

app.controller('weinerController', ['$scope', '$resource', '$http', '$routeParams', '$route', '$q', '$location', 'loginService', 'userService', 'weinerService', function($scope, $resource, $http, $routeParams, $route, $q, $location, loginService, userService, weinerService) {
  $scope.getAuthPromise = loginService.checkAuth().$promise;
  $scope.getUsersPromise = userService.getUsers().$promise;
  $scope.getWeinersPromise = weinerService.getWeiners().$promise;

  $scope.getAuthPromise.then(function(result) {
    if(!result.userId) {
      $location.path('/');
    }
    $scope.user = result;
    $scope.nakki = {
      weinerFrom: {
        userid:    $scope.user._id,
        username:  $scope.user.username
      },
      content: '',
      weinerTo: []
    };
  });
  
  $scope.getUsersPromise.then(function(result) {
    $scope.users = result;
  });

  $scope.getWeinersPromise.then(function(result) {
    $scope.weiners = result;
  });

  $scope.addToWeinerList = function() {
    var doc = {
      id: this.user._id,
      avatar: this.user.avatar
    };
    this.user.addedToList = true;
    $scope.nakki.weinerTo.push(doc);
  }

  $scope.addWeiner = function(nakki) {
    $scope.weiners.push(nakki);
    weinerService.saveWeiner(nakki);
    $scope.nakki = {weinerFrom: { userid: $scope.user._id, username: $scope.user.username}, content: '', weinerTo: []};
    _.each($scope.users, function(user) {
      user.addedToList = false;
    });
  };

  $scope.menuToggled = false;

}]);

app.controller('profileController', ['$scope', '$resource', '$http', '$routeParams', '$route', '$q', '$location', 'loginService', function($scope, $resource, $http, $routeParams, $route, $q, $location, loginService) {
  $scope.check = "It works, it works!";
  $scope.getAuthPromise = loginService.checkAuth().$promise;

  $scope.getAuthPromise.then(function(result) {
    if(result.userId) {
      $scope.auth = result;
      $location.path('/weiner/my/profile');
    } else {
      $scope.auth = result;
      $location.path('/');
    }
  });

}]);

app.controller('myWeinersController', ['$scope', '$resource', '$http', '$routeParams', '$route', '$q', '$location', 'loginService', function($scope, $resource, $http, $routeParams, $route, $q, $location, loginService) {
  $scope.check = "It works, it works!";
  $scope.getAuthPromise = loginService.checkAuth().$promise;

  $scope.getAuthPromise.then(function(result) {
    if(result.userId) {
      $scope.auth = result;
      $location.path('/weiner/my/weiners');
    } else {
      $scope.auth = result;
      $location.path('/');
    }
  });

}]);

app.controller('settingsController', ['$scope', '$resource', '$http', '$routeParams', '$route', '$q', '$location', 'loginService', function($scope, $resource, $http, $routeParams, $route, $q, $location, loginService) {
  $scope.check = "It works, it works!";
  $scope.getAuthPromise = loginService.checkAuth().$promise;

  $scope.getAuthPromise.then(function(result) {
    if(result.userId) {
      $scope.auth = result;
      $location.path('/weiner/my/settings');
    } else {
      $scope.auth = result;
      $location.path('/');
    }
  });

}]);
