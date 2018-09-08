const express = require('express');
const mqtt = require('mqtt')
const config = require("../config.json")
const fs = require("fs")
const Dbset=require("./midware/dbset")
const md5=require("md5")

const client = mqtt.connect(`mqtt://${config.mhost}:${config.mport}`)
const router = express.Router();
const link=new Dbset(config.db)

const path = './public/source/'
const domin = "https://file.mcfhq.com/"

link.connect()

client.on('connect', function () {
    console.log(`MQTT:connect to ${config.mhost}:${config.mport}`)
})

router.post('/require', function (req, res) {
    console.log(req.body)

    link._connection.query(`call get_info("${req.body.id}")`,(err,data)=>{
        url=data[0][0]['url']
        name=data[0][0]['name']
        let mailSetting={
            to: req.body.to,
            subject: 'convet',
            content: '您的书籍已经到达，请查收！',
            file: `https://${url}`,
            name:name
        }
        console.log(mailSetting)
        client.publish('mail', JSON.stringify(mailSetting), {
            qos: 0,
            retain: true
        })
    })
    res.end("我们会尽快推送")
});

router.post('/upload', (req, res) => {
    console.log(req.files.content.name)
    let content = fs.readFileSync(req.files.content.path)
    let hash=md5(content)
    link._connection.query({sql:`select count(*) as length from books where hash="${hash}"`},(err,data)=>{
        if(err)
            console.log(err)
        else{
            if(data[0]['length']==0){
                link._connection.query({sql:`call add_book("${req.files.content.name}","${hash}")`},(err,data,field)=>{
                    if(err)
                        console.log(err);
                    else if(data.affectedRows==1){            
                        console.log(hash)
                        client.publish('pushFile', JSON.stringify({
                            name: req.files.content.name,
                            hash:hash,
                            content: content
                        }), {
                            qos: 0,
                            retain: true
                        })
                    }
                })
            }
        }
    })
    fs.unlinkSync(req.files.content.path)
    res.end("ok")
})
module.exports = router;