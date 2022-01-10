require('module-alias/register')
let dbQuery = require("@db/query")
let notification = require("@controllers/notifications")
let devices = require("@controllers/devices")

module.exports = (aedes, connection) => {
    aedes.authenticate = function (client, key, password, callback) {
        // console.log(key)
        dbQuery.auth_check(key, connection, result => {
            if(result == 1){
                callback(null, key === key)
                // publish the new user has been connected
                let client_name = client.id.split('_')[3]
                let idType = client.id.split('_')[2]
                let id = client.id.split('_')[0]
                if(idType == 'mc'){
                    // do publish mc connect
                    aedes.publish({topic:`${id}/mc/status/online`, payload: Buffer.from(`online_${client_name}`)})
                    let message = `Perangkat ${client_name} telah terhubung ke smarttandon anda`
                    notification.sendNewNotification(id, message)
                    devices.sendNewDevices(id, client_name)
                }
                console.log(`${client.id} success auth`);
            }else{
                console.log("Error auth");
                var error = new Error('Auth error')
                error.returnCode = 4
                callback(error, null)
            }
        })
    }
}