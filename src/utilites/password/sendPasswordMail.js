import nodemailer from 'nodemailer' ;
import { passwordMailTemplate } from './passwordMailTemplate.js';

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  service: "gmail",     // the service that the mail uses

  auth: {
    user: "omniafarouk2003@gmail.com",
    pass: "ubxn eebj mubp jmnm", // from google app password, must enable 2-way verification
  },
  tls:{
     rejectUnauthorized:false
  }
});

export const sendPasswordMail = async (email,password) => {

  const info = await transporter.sendMail({
    from: '"Omnia" <omniafarouk2003@gmail.com>',

    to: email,

    subject: "Hello ✔",
    text: "Changing Your Password?", 
    html: passwordMailTemplate(email,password), 
  });

  console.log("Message sent:", info.messageId);
}
