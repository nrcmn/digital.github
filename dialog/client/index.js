var WebSocketServer = require('websocket').server;
var http = require('http');
var Firebase = require("firebase");
var myFirebaseRef = new Firebase("wss://dialog-app.firebaseio.com/");
var arr = [];

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


myFirebaseRef.on('child_added', function (nameSnapshot) {
    var val = nameSnapshot.val().value;
    sum = 0;

    arr.push(val);

    for (var i = 0; i < arr.length; i++) {
        sum += arr[i];
    }

    sum = sum/arr.length + 1;
    // console.log(sum/arr.length + 1);

})

wsServer.on('request', function(request) {
    var connection = request.accept('echo-protocol', request.origin);

    // console.log((new Date()) + ' Connection accepted.');
    connection.sendUTF(sum);

    connection.on('message', function(message) {
        if (message.utf8Data == 'ok') {
            connection.sendUTF(sum);
        }

        // console.log(message)

        // if (message.type === 'utf8') {
        //     console.log('Received Message: ' + message.utf8Data);
        //     connection.sendUTF(message.utf8Data);
        // }
        // else if (message.type === 'binary') {
        //     console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
        //     connection.sendBytes(message.binaryData);
        // }
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});


// ***************
//
// Create websocket server
//
// ***************

// var WebSocketServer = require('websocket').server;
// var http = require('http');

// var server = http.createServer(function(request, response) {
//     console.log((new Date()) + ' Received request for ' + request.url);
//     response.writeHead(404);
//     response.end();
// });
// server.listen(8080, function() {
//     console.log((new Date()) + ' Server is listening on port 8080');
// });


// wsServer = new WebSocketServer({
//     httpServer: server,
//     // You should not use autoAcceptConnections for production
//     // applications, as it defeats all standard cross-origin protection
//     // facilities built into the protocol and the browser.  You should
//     // *always* verify the connection's origin and decide whether or not
//     // to accept it.
//     autoAcceptConnections: false
// });

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  console.log('ok')
  return true;
}

// wsServer.on('request', function(request) {
//
//     // console.log(request)
//
//     // if (!originIsAllowed(request.origin)) {
//     //   // Make sure we only accept requests from an allowed origin
//     //   request.reject();
//     //   console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
//     //   return;
//     // }
//
//     var connection = request.accept('echo-protocol', request.origin);
//
//     console.log((new Date()) + ' Connection accepted.');
//     connection.sendUTF('Hello world');
//
//
//     connection.on('message', function(message) {
//
//         console.log(message)
//
//         // if (message.type === 'utf8') {
//         //     console.log('Received Message: ' + message.utf8Data);
//         //     connection.sendUTF(message.utf8Data);
//         // }
//         // else if (message.type === 'binary') {
//         //     console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
//         //     connection.sendBytes(message.binaryData);
//         // }
//     });
//     connection.on('close', function(reasonCode, description) {
//         console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
//     });
// });

//
// ***********************
// var WebSocketClient = require('websocket').client;
// var client = new WebSocketClient();
//
//
// client.on('connectFailed', function(error) {
//     console.log('Connect Error: ' + error.toString());
// });
//
// client.on('connect', function(connection) {
//     console.log('WebSocket Client Connected');
//     connection.on('error', function(error) {
//         console.log("Connection Error: " + error.toString());
//     });
//
//     connection.on('close', function() {
//         console.log('echo-protocol Connection Closed');
//     });
//
//     connection.on('message', function(message) {
//         // if (message.type === 'utf8') {
//         //     console.log("Received: '" + message.utf8Data + "'");
//         // }
//     });
//
//     function sendNumber() {
//         // if (connection.connected) {
//         //     var number = Math.round(Math.random() * 0xFFFFFF);
//         //     connection.sendUTF(number.toString());
//         //     setTimeout(sendNumber, 1000);
//         // }
//         connection.send('Hello world')
//     }
//     sendNumber();
// });
//
// client.connect('ws://localhost:8080/', 'echo-protocol');
