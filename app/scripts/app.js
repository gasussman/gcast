

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
        $scope.usernames.push($scope.newUsername);
        $scope.newUsername = "";
        if($scope.username === 'a') return;

        $('#userModal').modal('hide');
      };

      var video = document.querySelector("#videoElement");
 
          navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
           
          if (navigator.getUserMedia) {       
              navigator.getUserMedia({video: true}, handleVideo, videoError);
          }
           
          function handleVideo(stream) {
              video.src = window.URL.createObjectURL(stream);
          }
           
          function videoError(e) {
              // do something
          }

var localStream, localPeerConnection, remotePeerConnection;

var localVideo = document.getElementById("videoElement");


var startButton = document.getElementById("startButton");
var callButton = document.getElementById("callButton");
var hangupButton = document.getElementById("hangupButton");
startButton.disabled = false;
callButton.disabled = true;
hangupButton.disabled = true;
startButton.onclick = start;
callButton.onclick = call;
hangupButton.onclick = hangup;

function trace(text) {
  console.log((performance.now() / 1000).toFixed(3) + ": " + text);
}

function gotStream(stream){
  trace("Received local stream");
  localVideo.src = URL.createObjectURL(stream);
  localStream = stream;
  callButton.disabled = false;
}

function start() {
  trace("Requesting local stream");
  startButton.disabled = true;
  getUserMedia({audio:true, video:true}, gotStream,
    function(error) {
      trace("getUserMedia error: ", error);
    });
}

function call() {
  callButton.disabled = true;
  hangupButton.disabled = false;
  trace("Starting call");

  if (localStream.getVideoTracks().length > 0) {
    trace('Using video device: ' + localStream.getVideoTracks()[0].label);
  }
  if (localStream.getAudioTracks().length > 0) {
    trace('Using audio device: ' + localStream.getAudioTracks()[0].label);
  }

  var servers = null;

  localPeerConnection = new RTCPeerConnection(servers);
  trace("Created local peer connection object localPeerConnection");
  localPeerConnection.onicecandidate = gotLocalIceCandidate;

  remotePeerConnection = new RTCPeerConnection(servers);
  trace("Created remote peer connection object remotePeerConnection");
  remotePeerConnection.onicecandidate = gotRemoteIceCandidate;
  remotePeerConnection.onaddstream = gotRemoteStream;

  localPeerConnection.addStream(localStream);
  trace("Added localStream to localPeerConnection");
  localPeerConnection.createOffer(gotLocalDescription,handleError);
}

function gotLocalDescription(description){
  localPeerConnection.setLocalDescription(description);
  trace("Offer from localPeerConnection: \n" + description.sdp);
  remotePeerConnection.setRemoteDescription(description);
  remotePeerConnection.createAnswer(gotRemoteDescription,handleError);
}

function gotRemoteDescription(description){
  remotePeerConnection.setLocalDescription(description);
  trace("Answer from remotePeerConnection: \n" + description.sdp);
  localPeerConnection.setRemoteDescription(description);
}

function hangup() {
  trace("Ending call");
  localPeerConnection.close();
  remotePeerConnection.close();
  localPeerConnection = null;
  remotePeerConnection = null;
  hangupButton.disabled = true;
  callButton.disabled = false;
}

function gotRemoteStream(event){
  remoteVideo.src = URL.createObjectURL(event.stream);
  trace("Received remote stream");
}

function gotLocalIceCandidate(event){
  if (event.candidate) {
    remotePeerConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
    trace("Local ICE candidate: \n" + event.candidate.candidate);
  }
}

function gotRemoteIceCandidate(event){
  if (event.candidate) {
    localPeerConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
    trace("Remote ICE candidate: \n " + event.candidate.candidate);
  }
}

function handleError(){}

var sendChannel, receiveChannel;

var startButton = document.getElementById("startButton");
var sendButton = document.getElementById("sendButton");
var closeButton = document.getElementById("closeButton");
startButton.disabled = false;
sendButton.disabled = true;
closeButton.disabled = true;
startButton.onclick = createConnection;
sendButton.onclick = sendData;
closeButton.onclick = closeDataChannels;

function trace(text) {
  console.log((performance.now() / 1000).toFixed(3) + ": " + text);
}

function createConnection() {
  var servers = null;
  window.localPeerConnection = new RTCPeerConnection(servers,
    {optional: [{RtpDataChannels: true}]});
  trace('Created local peer connection object localPeerConnection');

  try {
    // Reliable Data Channels not yet supported in Chrome
    sendChannel = localPeerConnection.createDataChannel("sendDataChannel",
      {reliable: false});
    trace('Created send data channel');
  } catch (e) {
    alert('Failed to create data channel. ' +
          'You need Chrome M25 or later with RtpDataChannel enabled');
    trace('createDataChannel() failed with exception: ' + e.message);
  }
  localPeerConnection.onicecandidate = gotLocalCandidate;
  sendChannel.onopen = handleSendChannelStateChange;
  sendChannel.onclose = handleSendChannelStateChange;

  window.remotePeerConnection = new RTCPeerConnection(servers,
    {optional: [{RtpDataChannels: true}]});
  trace('Created remote peer connection object remotePeerConnection');

  remotePeerConnection.onicecandidate = gotRemoteIceCandidate;
  remotePeerConnection.ondatachannel = gotReceiveChannel;

  localPeerConnection.createOffer(gotLocalDescription,handleError);
  startButton.disabled = true;
  closeButton.disabled = false;
}

function sendData() {
  var data = document.getElementById("dataChannelSend").value;
  sendChannel.send(data);
  trace('Sent data: ' + data);
}

function closeDataChannels() {
  trace('Closing data channels');
  sendChannel.close();
  trace('Closed data channel with label: ' + sendChannel.label);
  receiveChannel.close();
  trace('Closed data channel with label: ' + receiveChannel.label);
  localPeerConnection.close();
  remotePeerConnection.close();
  localPeerConnection = null;
  remotePeerConnection = null;
  trace('Closed peer connections');
  startButton.disabled = false;
  sendButton.disabled = true;
  closeButton.disabled = true;
  dataChannelSend.value = "";
  dataChannelReceive.value = "";
  dataChannelSend.disabled = true;
  dataChannelSend.placeholder = "Press Start, enter some text, then press Send.";
}

function gotLocalDescription(desc) {
  localPeerConnection.setLocalDescription(desc);
  trace('Offer from localPeerConnection \n' + desc.sdp);
  remotePeerConnection.setRemoteDescription(desc);
  remotePeerConnection.createAnswer(gotRemoteDescription,handleError);
}

function gotRemoteDescription(desc) {
  remotePeerConnection.setLocalDescription(desc);
  trace('Answer from remotePeerConnection \n' + desc.sdp);
  localPeerConnection.setRemoteDescription(desc);
}

function gotLocalCandidate(event) {
  trace('local ice callback');
  if (event.candidate) {
    remotePeerConnection.addIceCandidate(event.candidate);
    trace('Local ICE candidate: \n' + event.candidate.candidate);
  }
}

function gotRemoteIceCandidate(event) {
  trace('remote ice callback');
  if (event.candidate) {
    localPeerConnection.addIceCandidate(event.candidate);
    trace('Remote ICE candidate: \n ' + event.candidate.candidate);
  }
}

function gotReceiveChannel(event) {
  trace('Receive Channel Callback');
  receiveChannel = event.channel;
  receiveChannel.onmessage = handleMessage;
  receiveChannel.onopen = handleReceiveChannelStateChange;
  receiveChannel.onclose = handleReceiveChannelStateChange;
}

function handleMessage(event) {
  trace('Received message: ' + event.data);
  document.getElementById("dataChannelReceive").value = event.data;
}

function handleSendChannelStateChange() {
  var readyState = sendChannel.readyState;
  trace('Send channel state is: ' + readyState);
  if (readyState == "open") {
    dataChannelSend.disabled = false;
    dataChannelSend.focus();
    dataChannelSend.placeholder = "";
    sendButton.disabled = false;
    closeButton.disabled = false;
  } else {
    dataChannelSend.disabled = true;
    sendButton.disabled = true;
    closeButton.disabled = true;
  }
}

function handleReceiveChannelStateChange() {
  var readyState = receiveChannel.readyState;
  trace('Receive channel state is: ' + readyState);
}

function handleError(){}

  }]);

gcastCapstoneApp.service('VideoStream', [ '$rootScope', function($rootScope) {
  }]);




