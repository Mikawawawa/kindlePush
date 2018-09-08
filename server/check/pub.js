const mqtt = require('mqtt')
const package = require("../package.json")
const client = mqtt.connect(`mqtt://${package.config.mhost}:${package.config.mport}`)



client.on('connect', function () {
    console.log(`connect to mqtt://${package.config.mhost}:${package.config.mport}`)
})
client.on("error",(err)=>{
    console.log(err)
})


const config={
    to:"lancelotnemoj@qq.com",
    subject:"convert",
    content:"这是之前你要的文件，我发给你了",
    file:"https://www.mcfhq.com/test.docx"
}
client.publish('mail', JSON.stringify(config), { qos: 0, retain: true })
