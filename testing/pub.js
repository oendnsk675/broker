var mqtt = require('mqtt');
const {url, api_key, willTopic} = require("../config/mqtt.config")
var client = mqtt.connect(url, 
            {
            username : api_key,
            password : api_key, 
            clientId: `${api_key}_${randomString(8, '#Ab1')}_mc_tandon1`,
            will : {
                topic: willTopic,
                payload: Buffer.from(`offline_tandon1`), // Payloads are buffers
            },
        });

function randomString(length, chars) {
    var mask = '';
    if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
    if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (chars.indexOf('#') > -1) mask += '0123456789';
    if (chars.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
    var result = '';
    for (var i = length; i > 0; --i) result += mask[Math.floor(Math.random() * mask.length)];
    return result;
}



client.on('connect', function () {
    // client.subscribe('cozcoz');
    client.publish('mc/controll/toggle', '1');
    setInterval(() => {
        data_air = Math.floor(Math.random() * 19).toString();
        // client.subscribe('mc/data');
        client.publish('mc/data', data_air);
        client.publish('mc/data/curva', data_air);
        
        // client.publish('kenaikan_air', data_air.toString());
    }, 3000);
})

client.on('close', ()=>{
    console.log('disconnect');
    // client.publish('mc/control/toggle', '0');
})

client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString());
//   client.end();
});
