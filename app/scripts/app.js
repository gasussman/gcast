

/**
 * @ngdoc overview
 * @name gcastCapstoneApp
 * @description
 * # gcastCapstoneApp
 *
 * Main module of the application.
 */
 gcastCapstoneApp = angular.module('gcastCapstoneApp', ['ui.router']);
 
  gcastCapstoneApp.config(['$stateProvider', '$locationProvider', function($stateProvider, $locationProvider) {
   $locationProvider.html5Mode(true);

   $stateProvider.state('landing', {
     url: '/',
     templateUrl: '/templates/landing.html'
   });

   $stateProvider.state('stream', {
     url: '/stream',
     controller: 'ChatCtrl',
     templateUrl: '/templates/stream.html'
   });

 }]);

gcastCapstoneApp.controller('ChatCtrl', ['$scope', function($scope) {
      var sock = new SockJS('http://127.0.0.1:9999/chat');
      $scope.messages = [];
      $scope.usernames = [];
      $scope.username = "Guest-" + Math.floor(Math.random()*9999);
      $scope.messageText = "";

      $scope.sendMessage = function() {
          sock.send($scope.username + ": " + $scope.messageText);
          $scope.messageText = "";
      };

      sock.onmessage = function(e) {
          $scope.messages.push(e.data);
          $scope.$apply();
      };

      $scope.registerUser = function() {
      
        

        $scope.username = $scope.newUsername;
        $scope.newUsername = "";
        if($scope.username === 'a') return false;
        $('#userModal').modal('hide');
      };

  }]);

gcastCapstoneApp.service('VideoStream', [ '$rootScope', function($rootScope) {
  }]);




