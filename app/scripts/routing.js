angular.module('mindmap', ['ngRoute', 'ui.bootstrap'])
.controller('MainController', function($scope, $route, $routeParams, $location,USER_ROLES, AuthService) {
   $scope.$route = $route;
   $scope.$location = $location;
   $scope.$routeParams = $routeParams;
   $scope.currentUser = null;
   $scope.userRoles = USER_ROLES;
   $scope.isAuthorized = AuthService.isAuthorized;
   $scope.login = AuthService.login;
})
.constant('AUTH_EVENTS', {
  loginSuccess: 'auth-login-success',
  loginFailed: 'auth-login-failed',
  logoutSuccess: 'auth-logout-success',
  sessionTimeout: 'auth-session-timeout',
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized'
})
.constant('USER_ROLES', {
  all: '*',
  admin: 'admin',
  editor: 'editor',
  guest: 'guest'
})
.factory('AuthService', function ($http, Session, $location) {
  return {
    login: function (credentials) {
      return $http
        .post('/login', credentials)
        .then(function (res) {
          Session.create(res.id, res.userid, res.role);
          $location.path('/'); // redirects the user to home
        });
    },
    isAuthenticated: function () {
      return !!Session.userId;
    },
    isAuthorized: function (authorizedRoles) {
      if (!angular.isArray(authorizedRoles)) {
        authorizedRoles = [authorizedRoles];
      }
      return (this.isAuthenticated() &&
        authorizedRoles.indexOf(Session.userRole) !== -1);
    }
  };
})
.service('Session', function () {
  this.create = function (sessionId, userId, userRole) {
    this.id = sessionId;
    this.userId = userId;
    this.userRole = userRole;
  };
  this.destroy = function () {
    this.id = null;
    this.userId = null;
    this.userRole = null;
  };
  return this;
})
.controller('demoController', function($scope, $route, $routeParams, $location, $http) {
     $scope.$route = $route;
     $scope.$location = $location;
     $scope.$routeParams = $routeParams;
     $scope.showText = false;
     $scope.clickHandler = function(d) {
        $scope.showText = true;
        //remove text after a timeout
     };
     $scope.submit = function(d) {
       $scope.showText = false;
     };
     $scope.save = function() {
      var treeData = flatten(root);
      var payload = {
        username: 'mario',
        password: 'itsamemario',
        mindmap: [treeData]
      };
      $http({
        method: 'POST',
        url: 'http://localhost:9000' + '/' + 'save',
        data: payload
      })
      .success(function(){
        // console.log('success');

      })
      .error(function(){
        console.log('Post FAILED, YOU LOSE');
      });


      //if logged in, send tree data to server using $http
         //first ask for a name for the tree
         //note the username and session id
      //if not logged in, save the tree locally, redirect the user to the login page

     };
 })
.service('Session', function () {
  this.create = function (sessionId, userId, userRole) {
    this.id = sessionId;
    this.userId = userId;
    this.userRole = userRole;
  };
  this.destroy = function () {
    this.id = null;
    this.userId = null;
    this.userRole = null;
  };
  return this;
})
.controller('createController', function($scope, $route, $routeParams, $location, $http) {
     $scope.$route = $route;
     $scope.$location = $location;
     $scope.$routeParams = $routeParams;
     $scope.showText = false;
     $scope.save = function() {
      var treeData = flatten(root);
      console.log(treeData);
      $http({
        method: 'POST',
        url: 'http://localhost:9000' + '/' + 'save',
        data: treeData 
      })
      .success(function(){
        console.log('success');
      })
      .error(function(){
        console.log('Post FAILED, YOU LOSE');
      });
      // $scope.retrieve = function() {
      //   $http
      // }
      //if logged in, send tree data to server using $http
         //first ask for a name for the tree
         //note the username and session id
      //if not logged in, save the tree locally, redirect the user to the login page
     };
 })
// .controller('AlertDemoCtrl', function($scope) {
//   $scope.closeAlert = function(index) {
//     $scope.alerts.splice(index, 1);
//   };

// })
.config(function($routeProvider, $locationProvider) {
  $routeProvider
   .when('/', {
    templateUrl: 'home.html',
    controller: 'MainController',
  })
  .when('/demo', {
    templateUrl: 'demo.html',
    controller: 'demoController'
  })
  .when('/create', {
    templateUrl: 'create.html',
    controller: 'createController'
  })
  .when('/login', {
    templateUrl: 'login.html'
  })
});

//if click save, whilst login, save.  otherwise save to local storage and re-direct to another apge