var mqtt = require('mqtt')
var client = mqtt.connect('mqtt://localhost:1882', 
            {
                username : '101037035320208252237',
                password : '101037035320208252237',  
                clientId: `101037035320208252237_${randomString(8, '#Ab1')}_web`
            })
var topic = ['mc/data', 'mc/status']

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


client.on('connect', ()=>{
    client.subscribe(topic)
})

client.on('close', ()=>{
    console.log('disconnect');
})

client.on('message', (topic, message)=>{
    message = message.toString();
    // message =
    //  JSON.parse(message);
    console.log(message);
})

