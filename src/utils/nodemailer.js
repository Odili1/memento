const nodemailer = require('nodemailer')
require('dotenv').config()

const sendMail = async(mailOptions) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        host: 'smpt.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.USERMAIL,
            pass: process.env.MAILPASS
        }
    })

    await transporter.sendMail({
        from: process.env.USERMAIL,
        to: mailOptions.email,
        subject: mailOptions.subject,
        html: mailOptions.html
    })
    console.log(`email sent`);
}

module.exports = sendMail