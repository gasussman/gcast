

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
     controller: 'Landing.controller',
     templateUrl: '/templates/landing.html'
   });

   $stateProvider.state('stream', {
     url: '/stream',
     controller: 'Stream.controller',
     templateUrl: '/templates/stream.html'
   });

 }]);

gcastCapstoneApp.controller('Stream.controller', ['$scope', 'ChatWindow', 'VideoStream', 
function($scope, ChatWindow, VideoStream) {
}]);

gcastCapstoneApp.service('ChatWindow', [ '$rootScope', function($rootScope) {
  }]);

gcastCapstoneApp.service('VideoStream', [ '$rootScope', function($rootScope) {
  }]);




