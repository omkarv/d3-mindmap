angular.module('mindmap', ['ngRoute', 'ui.bootstrap'])
 .controller('MainController', function($scope, $route, $routeParams, $location) {
     $scope.$route = $route;
     $scope.$location = $location;
     $scope.$routeParams = $routeParams;
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


      //if logged in, send tree data to server using $http
         //first ask for a name for the tree
         //note the username and session id
      //if not logged in, save the tree locally, redirect the user to the login page

     };
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

      //if logged in, send tree data to server using $http
         //first ask for a name for the tree
         //note the username and session id
      //if not logged in, save the tree locally, redirect the user to the login page

     };
 })
// .controller('AlertCtrl', function($scope) {
//   $scope.alerts = [
//     { type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' },
//     { type: 'success', msg: 'Well done! You successfully read this important alert message.' }
//   ];

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