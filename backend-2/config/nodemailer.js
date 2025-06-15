import nodemailer from "nodemailer";
const mailer = nodemailer.createTransport({
  service: "gmail",
  secure : true,
  port : 465,
  auth: {
    user: process.env.NodeMailerUser,
    pass: process.env.NodeMailerPass,
  }
});

export default mailer;