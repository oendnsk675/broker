require('module-alias/register')
let axios = require("@config/axios.config").axios
exports.sendNewDevices = (api_key, client_name) => {
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