require('angular');
require('angular-route');
require('angular-resource');
require('angular-off-click');
require('angular-socket-io');
// require('angular-animate');
window._ = require('lodash');
var views = 'views/';

angular.module('nakkikone', ['ngRoute', 'ngResource', 'weiner', 'offClick', 'btford.socket-io']);

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
    });
  
  // $locationProvider.html5Mode(true);
}]);


app.run(['$rootScope', '$location', function($rootScope, $location) {
  $rootScope.$on('$routeChangeSuccess', function() {
    $rootScope.showHeader = false; 
    if($location.path() === '/weiner' || $location.path() === '/weiner/my/profile') {
      $rootScope.showHeader = true;
    }
  });
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
    },
    completeWeiner: {
      method: 'PUT',
      url: 'api/weiners/:id/done'
    },
    checkWeiner: {
      method: 'PUT',
      url: 'api/weiners/:id/check'
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

app.factory('mySocket',['socketFactory', function (socketFactory) {
  var mySocket = socketFactory();
  mySocket.forward('event:connect');
  mySocket.forward('event:weiner:get');
  mySocket.forward('event:weiner:save');
  mySocket.forward('event:weiner:check');
  mySocket.forward('event:weiner:done');
  return mySocket;
}]);

app.controller('weinerController', ['$scope', '$resource', '$http', '$routeParams', '$route', '$q', '$location', 'loginService', 'userService', 'weinerService', 'mySocket', function($scope, $resource, $http, $routeParams, $route, $q, $location, loginService, userService, weinerService, mySocket) {
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
      weinerTo: [],
      status: 'IN PROGRESS'
    };
  });
  
  $scope.getUsersPromise.then(function(result) {
    $scope.users = result;
  });

  // $scope.getWeinersPromise.then(function(result) {
  //   $scope.weiners = result;

  // });

  $scope.$on('socket:event:weiner:get', function (ev, data) {
    $scope.weiners = data.weiners;
  });

  $scope.$on('socket:event:weiner:save', function (ev, data) {
    $scope.weiners = weinerService.getWeiners();
  });

  $scope.addToWeinerList = function() {
    var doc = {
      userid: this.user._id,
      avatar: this.user.avatar,
      userChecked: false
    };

    this.user.addedToList = true;
    $scope.nakki.weinerTo.push(doc);
  }

  $scope.addWeiner = function(nakki) {
    // $scope.weiners = weinerService.getWeiners();
    weinerService.saveWeiner(nakki);
    $scope.nakki = {weinerFrom: { userid: $scope.user._id, username: $scope.user.username}, content: '', weinerTo: [], status: 'IN PROGRESS'};
    _.each($scope.users, function(user) {
      user.addedToList = false;
    });
  };

  $scope.$on('socket:event:connect', function (ev, data) {
    console.log(data);
  });



  $scope.menuToggled = false;

}]);

app.controller('profileController', ['$scope', '$resource', '$http', '$routeParams', '$route', '$q', '$location', 'loginService', 'weinerService', function($scope, $resource, $http, $routeParams, $route, $q, $location, loginService, weinerService) {
  $scope.check = "It works, it works!";
  $scope.getAuthPromise = loginService.checkAuth().$promise;
  $scope.getWeinersPromise = weinerService.getWeiners().$promise;
  $q.all([$scope.getAuthPromise, $scope.getWeinersPromise]).then(function(data) {
    $scope.user = data[0];
    $scope.weiners = data[1];

    if(!$scope.user.userId) {
      $location.path('/');
    }
    $scope.sentWeiners = _.filter($scope.weiners, {'weinerFrom': {'userid': $scope.user._id }});
    $scope.numSent = $scope.sentWeiners.length;

    $scope.receivedWeiners = _.filter($scope.weiners, function(weiner) {
      return _.any(weiner.weinerTo, {'userid': $scope.user._id});
    });

    $scope.numReceived = $scope.receivedWeiners.length;

    $scope.newWeiners = _.filter($scope.weiners, function(weiner) {
      return _.any(weiner.weinerTo, {'userid': $scope.user._id, 'userChecked': false});
    });
  });

  $scope.setChecked = function() {
    var clickedWeiner = _.filter($scope.weiners, {'_id': this.weiner._id});
    var setCheckedOnClicked = _.filter(clickedWeiner[0].weinerTo, {'userid': $scope.user._id});
    setCheckedOnClicked[0].userChecked = true;
    console.log(setCheckedOnClicked[0]);
    _.where($scope.newWeiners, {'weinerTo': {'userid': setCheckedOnClicked[0].userid}});
    $scope.newWeiners
    // weinerService.checkWeiner({id: this.weiner._id}, clickedWeiner);
  };

  $scope.setDone = function() {
    weinerService.completeWeiner({id: this.weiner._id}, this.weiner);
  };  

  
}]);
