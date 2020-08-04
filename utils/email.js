const nodemailer = require('nodemailer');

const sendEmail = async options => {
  //create transporter
  const transporter = nodemailer.createTransport({
    //service: 'Gmail', // Activate less secure app in Gmail account setting
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const mailOptions = {
    from: 'Sumit Pal <wdsumit.pal@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message
    // html
  }

  await transporter.sendMail(mailOptions); 
}

module.exports = sendEmail;