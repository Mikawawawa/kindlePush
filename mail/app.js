const sendMail=require("./sendMail")
const mqtt = require('mqtt')
const client = mqtt.connect(`mqtt://101.132.116.211:8201`)

client.on('connect', function () {
    console.log(`connect to mqtt://101.132.116.211:8201`)
    client.subscribe('mail',{qos:1});//订阅主题为test的消息  
})
client.on("error",(err)=>{
    console.log(err)
})

client.on('message',function(top,message) {  
    switch (top) {
        case "mail":
            sendMail(JSON.parse(message))
            break;
        default:
            break;
    }
});