var mqtt = require('mqtt');
// var client = mqtt.connect('mqtt://localhost:1882');
var client = mqtt.connect('mqtt://belajarnode1.herokuapp.com:1882');
// console.log();

// function randomString(length, chars) {
//     var mask = '';
//     if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
//     if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
//     if (chars.indexOf('#') > -1) mask += '0123456789';
//     if (chars.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
//     var result = '';
//     for (var i = length; i > 0; --i) result += mask[Math.floor(Math.random() * mask.length)];
//     return result;
// }



client.on('connect', function () {
    console.log('connect');
    // client.subscribe('cozcoz');
    // setInterval(() => {
    //     data_air = Math.floor(Math.random() * 25);
    //     // client.subscribe('mc/data');
    //     client.publish('mc/data', data_air.toString());
    //     // client.publish('kenaikan_air', data_air.toString());
    // }, 3000);
})

client.on('close', ()=>{
    console.log('disconnect');
})

// client.on('message', function (topic, message) {
//   // message is Buffer
//   console.log(message.toString());
// //   client.end();
// });
