const aedes = require('aedes')()
const server = require('net').createServer(aedes.handle)
const port = 5000

server.listen(port, function () {
  console.log('server started and listening on port ', port)
})