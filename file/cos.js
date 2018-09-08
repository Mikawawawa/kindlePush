// 引入模块
const COS = require('cos-nodejs-sdk-v5')
const config=require("../config.json")
const fs=require("fs")
// 创建实例
const cos = new COS({
    SecretId: config.cos.SecretId,
    SecretKey: config.cos.SecretKey,
});

function setting(name,path){
    let settings=config.cos.setting
    settings.Key=name
    settings.Body=fs.readFileSync(path),
    setting.onProgress= function (progressData) {
        console.log(progressData);
    }
    return settings
}

module.exports=function(name,path,callback){
    cos.putObject(setting(name,path),(err, data)=>{
        if(err) {
            console.log(err);
        } else {
            callback(data);
        }
    });
}