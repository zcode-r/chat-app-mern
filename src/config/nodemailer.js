import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const transport=nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
})

transport.verify((err,suc)=>{
    if(err){
        console.log("Error connecting to email")
    }
    else{
        console.log("Connected to email!")
    }
})

export default transport