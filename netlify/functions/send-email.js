const nodemailer = require("nodemailer");

exports.handler = async function(event){

try{

const {to,subject,message}=JSON.parse(event.body)

const transporter = nodemailer.createTransport({
host: "smtp-relay.brevo.com",
port: 587,
auth: {
user: process.env.BREVO_USER,
pass: process.env.BREVO_PASS
}
})

await transporter.sendMail({
from: process.env.BREVO_FROM,
to: to,
subject: subject,
text: message,
html: `<p>${message}</p>`
})

return {
statusCode:200,
body:JSON.stringify({success:true})
}

}catch(err){

return {
statusCode:500,
body:JSON.stringify({success:false,error:err.message})
}

}

}