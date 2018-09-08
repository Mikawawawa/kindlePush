const nodemailer = require("nodemailer")
const config=require("../config.json")
const outlook=config.mail.outlook
const netcast=config.mail.netcast

inuse=outlook
const transporter = nodemailer.createTransport(inuse);

function setMail(to,subject="",text="",file="",name="") {
    let mailOptions = {
        from: `"Zeoyloa" <${inuse.auth.user}>`,
        to:to,
        envelope: {
            from: `"Zeoyloa" <${inuse.auth.user}>`,
            to: `<${to}>`
        },
        subject: subject
    }
    if(text){
        mailOptions.text=text
    }
    if(file){
        mailOptions.attachments=[
            {
                path:file,
                filename:name
            }
        ]
    }
    console.log(mailOptions)
    return mailOptions
}

module.exports=function(config){
    let {to,subject,content,file,name}=config
    transporter.sendMail(setMail(to,subject,content,file,name), (err, info) => {
        if (err)
            console.log(err)
        else
            console.log(`Email sent: \n${info.response}`)
    })  
}