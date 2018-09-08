const mqtt = require('mqtt')
const config = require("../config.json")
const fs = require("fs")
// const COS = require('cos-nodejs-sdk-v5')
const upload=require("./cos")
const Dbset=require("../web/midware/dbset")

const client = mqtt.connect(`mqtt://${config.mhost}:${config.mport}`)
const link=new Dbset(config.db)
// const cos = new COS({
//     SecretId: config.cos.SecretId,
//     SecretKey: config.cos.SecretKey,
// });

client.on('connect', function () {
    console.log(`MQTT:connect to ${config.mhost}:${config.mport}`)
    client.subscribe('pushFile', {
        qos: 1
    });
})

client.on('message', function (top, message) {
    message = JSON.parse(message)
    switch (top) {
        //存储web服务器发送的文件
        case 'pushFile':
            //本地模式运行
            if(config.mode=="local"){
                fs.writeFile(`./source/${message.name}`, message.content.toBuffer(), (err) => {
                    if (err) throw err;
                    link.query(`call add_url("${message.name}","${message.hash}","${config.domin+message.name}")`)
                });
            //存储在cos中    
            }else if(config.mode=="cos"){
                console.log("receive")
                message.content=Buffer(message.content)
                fs.writeFile(`./source/${message.name}`, message.content, (err) => {
                    if (err) throw err;
                    upload(message.name,`./source/${message.name}`,(info)=>{
                        console.log(info)
                        link._connection.query(`call add_url("${message.name}","${message.hash}","${info.Location}")`)
                        fs.unlinkSync(`./source/${message.name}`)
                    })
                });
            }
            console.log(`The file ${message.name} has been saved!`);
            break;
        default:
            break;
    }
});
