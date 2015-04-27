angular.module('ceoApp', ['ngWebSocket', 'frapontillo.gage','ui.odometer'])

.controller('GetDataCtrl', function ($scope, $websocket) {
    var dataStream = $websocket('wss://thawing-everglades-2491.herokuapp.com/');
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
    };

    $scope.levelColors = ['#ef473a', '#f0be32','#feda24', '#33cd5f'];

    $scope.textRenderer = function (value) {
        return value;
    };
})
