

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

gcastCapstoneApp.controller('Stream.controller', ['$scope', 'ChatCtrl', 'VideoStream', 
function($scope, ChatWindow, VideoStream) {
}]);

gcastCapstoneApp.service('ChatCtrl', [ '$rootScope', function($rootScope) {
  var sock = new SockJS('http://192.168.0.74:9999/chat');
    function ChatCtrl($scope) {
        $scope.messages = [];
        $scope.sendMessage = function() {
            sock.send($scope.messageText);
            $scope.messageText = "";
        };

        sock.onmessage = function(e) {
            $scope.messages.push(e.data);
            $scope.$apply();
        };
    }

  var http = require('http');
var sockjs = require('sockjs');

var connections = [];

var chat = sockjs.createServer();
chat.on('connection', function(conn) {
    connections.push(conn);
    var number = connections.length;
    conn.write("Welcome, User " + number);
    conn.on('data', function(message) {
        for (var ii=0; ii < connections.length; ii++) {
            connections[ii].write("User " + number + " says: " + message);
        }
    });
    conn.on('close', function() {
        for (var ii=0; ii < connections.length; ii++) {
            connections[ii].write("User " + number + " has disconnected");
        }
    });
});

var server = http.createServer();
chat.installHandlers(server, {prefix:'/chat'});
server.listen(9999, '0.0.0.0');
  }]);

gcastCapstoneApp.service('VideoStream', [ '$rootScope', function($rootScope) {
  }]);




