import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    user: process.env.MAILE_USER,
    pass: process.env.MAILE_PASS,
  },
});

export default async (email, code) => {
  const options = {
    from: `TecPro <restaurant.dev.723@gmail.com>`,
    to: email,
    subject: "Reset your password",
    html: `
    <h1>Please use the following Code to reset your password</h1>
    <p style="color:red;font-size:24px">${code}</p>
    
    <hr />
    <p>This email may containe sensetive information</p>
    <p>This code valable 1h</p>
   
  `, 
  };
  return new Promise((resolve, reject) => {
    transporter.sendMail(options, function (err, mail) {
      if (err) {
        console.log(err);
       return reject(err);
      }
      console.log(mail);
     return resolve();
    });
  });
};
