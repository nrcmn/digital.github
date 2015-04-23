var WebSocketServer = require('websocket').server;
var http = require('http');
var Firebase = require("firebase");
var myFirebaseRef = new Firebase("wss://dialog-app.firebaseio.com/");
var arr = [];

// Create server
var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(8080, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});

wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

// Create connection to firebase
myFirebaseRef.on('child_added', function (nameSnapshot) {
    // get value
    var val = nameSnapshot.val().value;
    sum = 0;
    arr.push(val);

    // cycle for value array
    for (var i = 0; i < arr.length; i++) {
        sum += arr[i];
    }

    // return average
    if(sum != 0){
        num = sum/(arr.length + 1);
    }
    else{
        num = 0;
    }
})

// create WebSockets listener
wsServer.on('request', function(request) {

    // if request
    var connection = request.accept('echo-protocol', request.origin);
    // send data
    connection.sendUTF(num.toString());
    connection.on('message', function(message) {
        // if connection message from client - ok
        if (message.utf8Data == 'ok') {
            // send data
            connection.sendUTF(num.toString());
        }
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});
