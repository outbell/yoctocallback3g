require('yoctolib-es2017/yocto_api.js');
require('yoctolib-es2017/yocto_cellular.js');

YAPI.LogUnhandledPromiseRejections();

async function HttpCallbackHandler(request, response) {
    // HTTP requests from the web browsers land here
 console.log('received '+request.method+' request for '+request.url);

    // Code below starts the library in HTTP Callback mode and interacts
    // with modules connected on the Hub that made the HTTP request
    YAPI.RegisterHub('http://callback/', function(ctx, retcode, errmsg) {
        if(retcode == YAPI.SUCCESS) {
            // Log all temperatures reported by Hub
            YAPI.UpdateDeviceList();
            var sensor = YSensor.FirstSensorInContext(ctx)
            while(sensor) {
                console.log(sensor.get_friendlyName() + ": " +
                            sensor.get_currentValue() + " °C")
                sensor = sensor.nextTemperature();
            }
        }
        // Returns the API to its original state and close the connection
        YAPI.FreeAPI();
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.write('Hello Browser<br>\n');
    response.end();
}, null, request, response);
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.write('Hello Browser<br>\n');
    response.end();
}

// async function WebSocketCallbackHandler(ws)
// {
//     // WebSocket connections from the YoctoHubs land here
//         console.log('Incoming WebSocket connection!');

    
// }

// We create an HTTP server...
var http = require('http');
http.createServer(HttpCallbackHandler).listen(8080);

// ... and we create a WebSocket server
// var WebSocketServer = require('ws').Server;
// let wss = new WebSocketServer({ port: 8044 });
// wss.on('connection', WebSocketCallbackHandler);

console.log('Node.js Web HTTP server running on http://...:8080/');
console.log('Node.js Websocket server running on http://...:8044/');