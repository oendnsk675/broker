function cekDataExists(id_user, month, connection, callback){
    connection.query(`SELECT id_user FROM data_usages WHERE id_user = ${id_user} AND MONTH(created_at) = ${month}`, (err, res) =>{
        if (err) throw err
        if(res.length > 0){
            return callback(1)
        }else{
            return callback(0)
        }
    })
}

function getIdCost(key, connection, callback){
    let query =  connection.query(`SELECT id, cost FROM users WHERE api_key = '${key}' LIMIT 1`, (err, res) => {
        if (err) throw err
        res.forEach(data=>{
            // console.log(data.id);
            return callback([data.id, data.cost])
        })
    });
}

exports.storeData = (client, connection) =>  {
        let dt = new Date();
        let dts =`${
            dt.getFullYear().toString().padStart(4, '0')}:${
            (dt.getMonth()+1).toString().padStart(2, '0')}:${
            dt.getDate().toString().padStart(2, '0')} ${
            dt.getHours().toString().padStart(2, '0')}:${
            dt.getMinutes().toString().padStart(2, '0')}:${
            dt.getSeconds().toString().padStart(2, '0')}`;
        getIdCost(client, connection, res => {
            let id = res[0] // id user
            let cost = res[1] // cost user
            let month = dt.getMonth()+1;
    
            // cek apakah ada data usage user pada bulan ke n
            cekDataExists(id, month, connection, res => {
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
        
}

exports.auth_check = (key, connection, callback) => {
    connection.query(`SELECT api_key FROM users WHERE api_key = '${key}'`, function (error, results, fields) {
    if (results.length > 0) {
        return callback(1);
    }else{
        return callback(0);
    }
    });
}