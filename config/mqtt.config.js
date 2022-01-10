module.exports = {
    port_mqtt: 1882, // port mqtt broker
    port_ws: 8888, // port web socket broker
    url: 'mqtt://localhost:1882', // for testing sub client and pub client on folder /testing
    api_key: '101037035320208252237', // api key after you success login on smarttandon website
    willTopic: 'mc/status/offline', // for testing pub on folder /testing
    topicOn: 'mc/status/online', // topic to find out which mc is active
    topicData: 'mc/data', // topic for water usage data from mc or iot device, the purpose of retrieving data from mc to do data storage to db
}