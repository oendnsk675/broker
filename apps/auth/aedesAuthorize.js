require('module-alias/register')
let dbQuery = require("@db/query")
const mc_data = require("@config/mqtt.config.js")
module.exports = (aedes, connection) => {
    aedes.authorizePublish = function (client, packet, callback) {
        packet.topic = `${client.id.split('_')[0]}/${packet.topic}`
        console.log(`${client.id} publish to topic : ${packet.topic}`);
        if(packet.topic == `${client.id.split('_')[0]}/${mc_data}`){
            dbQuery.storeData(client.id.split('_')[0], connection)
        }
        callback(null)
    }
    
    
    aedes.authorizeSubscribe = function (client, sub, callback) {
        sub.topic = `${client.id.split('_')[0]}/${sub.topic}`
        console.log(`${client.id} subscribe to topic : ${sub.topic}`);
        callback(null, sub)
    }
}