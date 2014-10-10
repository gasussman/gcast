

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
            $scope.sendMessage = function() {
                sock.send($scope.messageText);
                $scope.messageText = "";
            };

            sock.onmessage = function(e) {
                $scope.messages.push(e.data);
                $scope.$apply();
            };
  }]);

gcastCapstoneApp.service('VideoStream', [ '$rootScope', function($rootScope) {
  }]);




