import transport from "../config/nodemailer.js"

export const sendmail=async (to,subject,text)=>{
    try{
        const mailoperation={
            from:process.env.EMAIL_USER,
            to:to,
            subject:subject,
            text:text
        }

        await transport.sendMail(mailoperation)

        console.log(`Email sent to ${to}`)
    }
    catch(err){
        console.log(`Error sending email ${err}`)
    }
}