require('module-alias/register')
const aedes = require('aedes')();
const httpServer = require('http').createServer();
var server = require('net').createServer(aedes.handle);
const ws = require('websocket-stream');
const mysql      = require('mysql');
const port_mqtt = 1882;
const port_ws = 8888;

// db proccess
let connection = require("@db/index").connection(mysql)

server.listen(port_mqtt, function () {
	console.log('mqtt broker listening on port', port_mqtt)
})
ws.createServer({ server: httpServer }, aedes.handle);

httpServer.listen(port_ws, function () {
  console.log('websocket server listening on port ', port_ws);
});

// aedes authentication 
require("@auth/aedes")(aedes, connection)

// aedes client controller
require("@controllers/aedesClient")(aedes, connection)


// event

require("@auth/aedesAuthorize")(aedes, connection)