var md5 = require('md5');
var fs = require('fs');

module.exports=function(path){
    let buffer=fs.readFileSync(path)
    return md5(buffer)
}