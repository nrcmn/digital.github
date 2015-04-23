angular.module('ceoApp', ['ngWebSocket'])

.controller('GetDataCtrl', function ($scope, $websocket) {
    var dataStream = $websocket('ws://localhost:8080', 'echo-protocol');
    dataStream.onMessage(function(message) {
        console.log(message.data);
        $scope.result = message.data;
        $scope.$apply();
        
        dataStream.send('ok');
    });

    $scope.getData = function (arg) {
        dataStream.send(arg);
    }
})
