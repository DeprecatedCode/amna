var app = angular.module('amna-example-chat', []);

app.controller('chatController', function($scope, $http, $timeout) {

    var saveMessage = function(message) {
        message.status = 'saving';
        $http.post('/send', {message: message})
            .success(function(response) {
                angular.extend(message, response.data);
                message.status = 'saved';
            })
            .error(function(error) {
                message.status = 'error';
            });
    };

    var latestTime = 0;

    var addMessage = function(message) {
        if (message._id) {
            $scope.messages = $scope.messages.filter(function(existingMessage) {
                return existingMessage._id != message._id;
            });
        }
        $scope.messages.push(message);
        if (message.createdAt > latestTime) {
            //console.log(latestTime);
            latestTime = message.createdAt;
        }
        if (window.innerHeight + document.body.scrollTop > document.body.scrollHeight - 10) {
            $timeout(function() {
                document.body.scrollTop = document.body.scrollHeight;
            });
        }
    }

    var loadMessages = function(after) {
        $http.get('/messages?after=' + after)
        .success(function(response) {
            response.data.forEach(addMessage);
            $scope.error = false;
            loadMessagesSoon();
        })
        .error(function(error) {
            $scope.error = true;
            loadMessagesSoon();
        });
    };

    var loadMessagesSoon = function() {
        $timeout(function() {
            loadMessages(latestTime);
        }, 1000);
    };

    loadMessages(latestTime);

    // $scope.name = 'Michael';
    $scope.chatName = 'guest';

    $scope.messages = [];
    $scope.sendMessage = function (message, name) {
        if(!message) { 
            console.log('no message');
        } else {
            //console.log(message, name);
            var messageObject = {author: name, body: message, time: new Date};
            addMessage(messageObject);
            saveMessage(messageObject);
            $scope.chatMessage = '';
        }
        $timeout(function() {
            document.querySelector('.enter-message').focus();
        });
    };
})
// alert('its working!');