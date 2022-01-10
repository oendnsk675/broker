require('module-alias/register')
let notification = require("@controllers/notifications")

module.exports = (aedes) => {
    aedes.on('clientDisconnect', function (client) {
        let client_name = client.id.split('_')[3]
        let idType = client.id.split('_')[2]
        let id = client.id.split('_')[0]
        if(idType == 'mc'){
            let message = `Perangkat ${client_name} telah memutuskan sambungan ke smarttandon anda`
            notification.sendNewNotification(id, client_name, message)   
            console.log(`client mc ${client.id} disconnect`)
        }
        console.log(`client web ${client.id} disconnect`)
    })
    aedes.on('connectionError', function (client, error) {
        console.log(`client ${client.id} error connected`)
    })
    aedes.on('closed', function () {
        // console.log(`client ${client.id} error connected`)
    })
}