const aedes = require('aedes')();
const httpServer = require('http').createServer();
var server = require('net').createServer(aedes.handle);
const ws = require('websocket-stream');
const axios = require('axios')
axios.defaults.baseURL = 'http://127.0.0.1:8000/api';
const port_mqtt = 1882;
const port_ws = 8888;

// db proccess
var mysql      = require('mysql');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'laravuejwt'
});
    
connection.connect();

server.listen(port_mqtt, function () {
	console.log('mqtt broker listening on port : ', port_mqtt)
})
ws.createServer({ server: httpServer }, aedes.handle);

httpServer.listen(port_ws, function () {
  console.log('websocket server listening on port ', port_ws);
});


// sql function

function storeData(client){
    let dt = new Date();
    let dts =`${
        dt.getFullYear().toString().padStart(4, '0')}:${
        (dt.getMonth()+1).toString().padStart(2, '0')}:${
        dt.getDate().toString().padStart(2, '0')} ${
        dt.getHours().toString().padStart(2, '0')}:${
        dt.getMinutes().toString().padStart(2, '0')}:${
        dt.getSeconds().toString().padStart(2, '0')}`;
    getIdCost(client, res => {
        let id = res[0] // id user
        let cost = res[1] // cost user
        let month = dt.getMonth()+1;
        // console.log(id);
        // cek apakah ada data monthliy user pada bulan ke n (gak jadi)
        // cekDataExists(id, month, res => {
        //     // console.log(res);
        //     if(res > 0){
        //         connection.query(`UPDATE data_monthlies SET usages = usages + 1 WHERE id_user = '${id}' AND MONTH(created_at) = ${month}`, function (error, results, fields) {
        //             if (error) throw error;
        //             console.log('Berhasil update data bulanan');
        //         });
        //     }else{
        //         connection.query(`INSERT INTO data_monthlies (id, usages, id_user, created_at, updated_at) VALUES('', '1', '${id}', '${dts}', '${dts}')`, function (error, results, fields) {
        //             if (error) throw error;
        //             console.log('Berhasil insert data bulanan');
        //         });
        //     }
        // })

        // cek apakah ada data usage user pada bulan ke n
        cekDataExists(id, month, res => {
            // insert or update data usage user ke db
            if(res > 0){
                connection.query(`UPDATE data_usages SET usages = usages + 1, cost = cost + ${cost} WHERE id_user = ${id} AND MONTH(created_at) = ${month}`, (err, res) => {
                    if (err) throw error;
                    console.log('Berhasil update data penggunaan');
                })
            }else{
                connection.query(`INSERT INTO data_usages (id, usages, cost, id_user, created_at, updated_at) VALUES('', '1', '${cost}', '${id}', '${dts}', '${dts}')`, function (error, results, fields) {
                    if (error) throw error;
                    console.log('Berhasil insert data penggunaan');
                });
            }
        })
    })
    // console.log(id);
    // console.log(cost);
    
}

function cekDataExists(id_user, month, callback){
    connection.query(`SELECT id_user FROM data_monthlies WHERE id_user = ${id_user} AND MONTH(created_at) = ${month}`, (err, res) =>{
        if (err) throw err
        if(res.length > 0){
            return callback(1)
        }else{
            return callback(0)
        }
    })
}

function getIdCost(key, callback){
    let query =  connection.query(`SELECT id, cost FROM users WHERE api_key = '${key}' LIMIT 1`, (err, res) => {
        if (err) throw err
        res.forEach(data=>{
            // console.log(data.id);
            return callback([data.id, data.cost])
        })
    });
}

// function updateDataMode(data1, data2, user_id){
//     console.log(`mode = ${data1}`);
//       connection.query(`UPDATE modes SET automatis = '${data1}', manual = '${data2}' WHERE user_id =  '${user_id}'`, function (error, results, fields) {
//         if (error) throw error;
//         console.log('Berhasil merubah mode');
//       });
// }

// function updateSaklar(data, user_id){
//     connection.query(`UPDATE modes SET saklar = '${data}' WHERE user_id = '${user_id}'`, function(error){
//         if(error) throw error;
//         console.log('Berhasil merubah keadaan pompa');
//     });
// }

function auth_check(key, callback){
    connection.query(`SELECT api_key FROM users WHERE api_key = '${key}'`, function (error, results, fields) {
    if (results.length > 0) {
        return callback(1);
    }else{
        return callback(0);
    }
    });
}

function sendNewNotification(api_key, client_name, message){
    axios.post('/user/notification', 
    { 
        'description' : message,
        'read' : `0`,
        'api_key' :  `${api_key}` 
    }).then(re => {
        if(re.status == 201) {
            console.log(`Berhasil insert new notification`)
        }
    }).catch(err=>{
        // console.log(err);
        if(err.response.status == 500 || err.response.status == 404){ 
            console.log(`ada yang salah`);
        }else if(err.response.status == 401){
            console.warn(`unauthorized`);
        }
    })
}

function sendNewDevices(api_key, client_name){
    axios.post('/user/device', 
    { 
        'name' : client_name,
        'status' : `0`,
        'api_key' :  `${api_key}` 
    }).then(re => {
        if(re.status == 201) {
            console.log(`${re.data}`)
        }
    }).catch(err=>{
        // console.log(err);
        if(err.response.status == 500 || err.response.status == 404){ 
            console.log(`ada yang salah`);
        }else if(err.response.status == 401){
            console.warn(`unauthorized`);
        }
    })
}

// aedes function 

aedes.authenticate = function (client, key, password, callback) {
    // console.log(key)
    auth_check(key, result => {
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
                sendNewNotification(id, client_name, message)
                sendNewDevices(id, client_name)
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

// event

// aedes.on('client', function (client) {
    
//     // console.log(client.id)
//     console.log(`client ${client.id} connected`)
// })
aedes.on('clientDisconnect', function (client) {
    let client_name = client.id.split('_')[3]
    let idType = client.id.split('_')[2]
    let id = client.id.split('_')[0]
    if(idType == 'mc'){
        let message = `Perangkat ${client_name} telah memutuskan sambungan ke smarttandon anda`
        sendNewNotification(id, client_name, message)   
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

// event

aedes.authorizePublish = function (client, packet, callback) {
    packet.topic = `${client.id.split('_')[0]}/${packet.topic}`
    console.log(`${client.id} publish to topic : ${packet.topic}`);
    if(packet.topic == `${client.id.split('_')[0]}/mc/data`){
        storeData(client.id.split('_')[0])
    }
    callback(null)
}


aedes.authorizeSubscribe = function (client, sub, callback) {
    sub.topic = `${client.id.split('_')[0]}/${sub.topic}`
    console.log(`${client.id} subscribe to topic : ${sub.topic}`);
    callback(null, sub)
}



// subscribe
// aedes.subscribe('mc/data', (packet, cb)=>{
//     let data = packet.payload.toString();
//     // console.log(data);
//     // store ke db
    
// })
// aedes.subscribe('user/control/mode', (packet, cb)=>{
//     let data = packet.payload.toString();
//     if (data == '1') {
//         console.log(`mode auto : ${data}`);
//     }else if(data == '0'){
//         console.log(`mode manual : ${data}`);
//     }
//     console.log(data);
//     // store ke db, call api from smarttandon
//     cb();
// })
// aedes.subscribe('user/control/toggle', (packet, cb)=>{
//     let data = packet.payload.toString();
//     if (data == '1') {
//         console.log(`pompa dinyalakan : ${data}`);
//     }else if(data == '0'){
//         console.log(`pompa dimatikan : ${data}`);
//     }
//     console.log(data);
//     // store ke db
//     cb();
// })
// aedes.subscribe('mc/control/mode', (packet, cb)=>{
//     let data = packet.payload.toString();
//     if (data == '1') {
//         console.log(`mode : ${data}`);
//     }else if(data == '0'){
//         console.log(`mode : ${data}`);
//     }
//     console.log(data);
//     // store ke db
//     cb();
// })
// aedes.subscribe('mc/control/toggle', (packet, cb)=>{
//     let data = packet.payload.toString();
//     if (data == '1') {
//         console.log(`pompa dinyalakan : ${data}`);
//     }else if(data == '0'){
//         console.log(`pompa dimatikan : ${data}`);
//     }
//     console.log(data);
//     // store ke db
//     cb();
// })

// subscribe
