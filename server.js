require('yoctolib-es2017/yocto_api.js');
require('yoctolib-es2017/yocto_cellular.js');
var server = require('http').createServer();
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({ server: server });
wss.on('connection', WebSocketCallbackHandler);

YAPI.LogUnhandledPromiseRejections();

async function WebSocketCallbackHandler(ws)
{
    // WebSocket connections from the YoctoHubs land here
        console.log('Incoming WebSocket connection!');
    let errmsg = new YErrorMsg();
    let yctx = new YAPIContext();
    if(await yctx.RegisterHubWebSocketCallback(ws, errmsg) != YAPI.SUCCESS) {
        console.log('WebSocket callback error: '+errmsg);
        yctx.FreeAPI();
        return;
    }

     await yctx.UpdateDeviceList(errmsg);
  var module = YModule.FirstModuleInContext(yctx);
    while(module) {
        let msg = await module.get_serialNumber();
        let logicalname= await module. get_logicalName();
        msg += ' (' + (await module.get_productName()) + ')';
        console.log(msg);
        console.log("logicalname :"+ logicalname);
        module = module.nextModule();
    }

     let sensor = YSensor.FirstSensorInContext(yctx);
    while(sensor) {
        console.log('Sensor: ' + (await sensor.get_hardwareId()));
        console.log('Vale: '+(await sensor.get_currentValue()));
        // await sensor.set_reportFrequency("6/m");
        // await sensor.registerTimedReportCallback(sensorCallback);
        sensor = sensor.nextSensor();
    }

    let cell = YCellular.FirstCellularInContext(yctx);
    while(cell)
    {
        console.log('Operator: '+(await cell.get_cellOperator()));
        console.log('Details: '+(await cell.get_cellIdentifier()));
        cell=cell.nextCellular();
    }

      while(ws.readyState != ws.CLOSED) {
        await yctx.Sleep(1000);
    }
    await yctx.FreeAPI();
    
}
var port=process.env.PORT || 1337;

server.listen(port);
// We create an HTTP server...
// var http = require('http');
// http.createServer(HttpCallbackHandler).listen(port);

// ... and we create a WebSocket server


 //console.log('Node.js Web HTTP server running on '+ port);
 console.log('Node.js Websocket server running on '+port);