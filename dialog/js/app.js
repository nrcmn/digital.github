angular.module('ceoApp', ['ngWebSocket', 'ui.odometer'])

.controller('GetDataCtrl', function ($scope, $websocket) {
    var dataStream = $websocket('wss://whispering-retreat-6757.herokuapp.com');
    // var dataStream = $websocket('ws://localhost:5000/');
    dataStream.onMessage(function(message) {

        var data = JSON.parse(message.data);

        $scope.result = data.number;
        $scope.length = data.length;
        $scope.$apply();

        dataStream.send('ok');
    });

    $scope.getData = function (arg) {
        dataStream.send(arg);
    }
})
