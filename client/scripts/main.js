require('angular');
require('angular-route');
require('angular-resource');
require('angular-off-click');
require('angular-socket-io');
// require('angular-animate');
var _ = require('lodash');
var views = 'views/';

// Define modules
angular.module('nakkikone', ['ngRoute', 'ngResource', 'weiner', 'offClick', 'btford.socket-io']);

var app = angular.module('weiner', []);

// Assign controllers
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

// Start the application
app.run(['$rootScope', '$location', function($rootScope, $location) {
  // Add route listener
  $rootScope.$on('$routeChangeSuccess', function() {
    $rootScope.showHeader = false; 
    if($location.path() === '/weiner' || $location.path() === '/weiner/my/profile') {
      $rootScope.showHeader = true;
    }
  });
}]);

// Construct services
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

// Construct service for fetching,saving and updating weiners.
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

// Frontcontroller
app.controller('frontController', ['$scope', '$resource', '$http', '$routeParams', '$route', '$q', '$location', 'loginService', function($scope, $resource, $http, $routeParams, $route, $q, $location, loginService) {
  $scope.check = "It works, it works!";
  // Check user authentication
  $scope.getAuthPromise = loginService.checkAuth().$promise;
  // Authentication callback
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

// Construct service for forwarding socket events to angular.
app.factory('mySocket',['socketFactory', function (socketFactory) {
  var mySocket = socketFactory();
  mySocket.forward('event:connect');
  mySocket.forward('event:weiner:get');
  mySocket.forward('event:weiner:save');
  mySocket.forward('event:weiner:check');
  mySocket.forward('event:weiner:done');
  mySocket.forward('event:user:get');
  mySocket.forward('event:user:create');
  mySocket.forward('event:user:auth');
  return mySocket;
}]);

// Weiner controller
app.controller('weinerController', ['$scope', '$resource', '$http', '$routeParams', '$route', '$q', '$location', 'loginService', 'userService', 'weinerService', 'mySocket', '$rootScope', function($scope, $resource, $http, $routeParams, $route, $q, $location, loginService, userService, weinerService, mySocket, $rootScope) {

  $scope.getAuthPromise = loginService.checkAuth().$promise;
  $scope.getUsersPromise = userService.getUsers().$promise;
  $scope.getWeinersPromise = weinerService.getWeiners().$promise;

  $scope.getAuthPromise.then(function(result) {
    if(!result.userId) {
      $location.path('/');
    }

    $rootScope.user = result;
    // Init weiner values with user id and name.

    $scope.nakki = {
      weinerFrom: {
        userid:    $rootScope.user._id,
        username:  $rootScope.user.username
      },
      content: '',
      weinerTo: [],
      status: 'IN PROGRESS'
    };
  });
  
  // Add users to scope from fetched result
  $scope.getUsersPromise.then(function(result) {
    $scope.users = result;
  });

  // Add weiners to scope
  $scope.getWeinersPromise.then(function(result) {
    $scope.weiners = result;
  });

  // Event handlers
  // Get weiners
  $scope.$on('socket:event:weiner:get', function (ev, data) {
    $scope.weiners = data.weiners;
  });

  // Save weiner
  $scope.$on('socket:event:weiner:save', function (ev, data) {
    $scope.weiners.push(data.weiner);
  });

  // Get users
  $scope.$on('socket:event:user:get', function (ev, data) {
    $scope.users = data.users;
  });

  // Add user to receive a weiner.
  $scope.addToWeinerList = function() {
    // Set user values
    var doc = {
      userid: this.user._id,
      avatar: this.user.avatar,
      userChecked: false
    };
    this.user.addedToList = true;
    // Add user to weiners weinerTo list.
    $scope.nakki.weinerTo.push(doc);
  }

  // Saving weiner
  $scope.addWeiner = function(nakki) {
    weinerService.saveWeiner(nakki);
    // Weiner values from scope
     $scope.nakki = {weinerFrom: { userid: $rootScope.user._id, username: $rootScope.user.username}, content: '', weinerTo: [], status: 'IN PROGRESS'};
    _.each($scope.users, function(user) {
      user.addedToList = false;
    });
  };

  $scope.$on('socket:event:connect', function (ev, data) {
    console.log(data);
  });

  $scope.menuToggled = false;

}]);


// Profile controller
app.controller('profileController', ['$scope', '$resource', '$http', '$routeParams', '$route', '$q', '$location', 'loginService', 'weinerService', 'mySocket', '$rootScope', function($scope, $resource, $http, $routeParams, $route, $q, $location, loginService, weinerService, mySocket, $rootScope) {
  $scope.getAuthPromise = loginService.checkAuth().$promise;
  $scope.getWeinersPromise = weinerService.getWeiners().$promise;
  // Get user and all weiners
  $q.all([$scope.getAuthPromise, $scope.getWeinersPromise]).then(function(data) {
    $rootScope.user = data[0];
    $scope.weiners = data[1];
    

    if(!$rootScope.user.userId) {
      $location.path('/');
    }

    // Filter own weiners from all the weiners by checking if they were sent by the user.
     $scope.sentWeiners = _.filter($scope.weiners, {'weinerFrom': {'userid': $rootScope.user._id }});
    $scope.numSent = $scope.sentWeiners.length;

    // Filter received weiners from all the weiners by checking if user was listed in weiners weinerTo.
    $scope.receivedWeiners = _.filter($scope.weiners, function(weiner) {
      return _.any(weiner.weinerTo, {'userid': $rootScope.user._id});
    });

    $scope.numReceived = $scope.receivedWeiners.length;

  });

    // New weiners that user has not checked yet
    $scope.newWeiners = _.filter($scope.weiners, function(weiner) {
      return _.any(weiner.weinerTo, {'userid': $scope.user._id, 'userChecked': false});
    }).length;

  });

  // Weiner get listener to update new weiners 
  $scope.$on('socket:event:weiner:get', function (ev, data) {
    $scope.weiners = data.weiners;

    $scope.newWeiners = _.filter($scope.weiners, function(weiner) {
      return _.any(weiner.weinerTo, {'userid': $rootScope.user._id, 'userChecked': false});
    });

    $scope.receivedWeiners = _.filter($scope.weiners, function(weiner) {
      return _.any(weiner.weinerTo, {'userid': $rootScope.user._id});
    });
    $scope.numReceived = $scope.receivedWeiners.length;

    $scope.numNew = $scope.newWeiners.length;
  });

  // Weiner save listener
  $scope.$on('socket:event:weiner:save', function (ev, data) {
    $scope.weiners = weinerService.getWeiners();

    $scope.newWeiners = _.filter($scope.weiners, function(weiner) {
      return _.any(weiner.weinerTo, {'userid': $rootScope.user._id, 'userChecked': false});
    });

    $scope.receivedWeiners = _.filter($scope.weiners, function(weiner) {
      return _.any(weiner.weinerTo, {'userid': $rootScope.user._id});
    });
    $scope.numReceived = $scope.receivedWeiners.length;

    $scope.numNew = $scope.newWeiners.length;

  });

  $scope.$on('socket:event:weiner:check', function (ev, data) {
    $scope.weiners = weinerService.getWeiners();
    $scope.newWeiners = _.filter($scope.weiners, function(weiner) {
      return _.any(weiner.weinerTo, {'userid': $rootScope.user._id, 'userChecked': false});
    });

    $scope.numNew = $scope.newWeiners.length;
  });

  // Set weiner as checked
 $scope.setChecked = function() {
    var clickedWeiner = _.filter($scope.weiners, {'_id': this.weiner._id});
    var setCheckedOnClicked = _.filter(clickedWeiner[0].weinerTo, {'userid': $rootScope.user._id});
    setCheckedOnClicked[0].userChecked = true;
    weinerService.checkWeiner({id: this.weiner._id}, setCheckedOnClicked);

  };

  // Set weiner done
  $scope.setDone = function() {
    this.weiner.status = 'DONE';
    weinerService.completeWeiner({id: this.weiner._id}, this.weiner);
  };  

  
}]);