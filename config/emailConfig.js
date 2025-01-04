// /config/emailConfig.js
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL, // Email address from .env
    pass: process.env.EMAIL_PASSWORD, // Email password or app-specific password
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("Error configuring email transporter:", error);
  } else {
    console.log("Email transporter is ready to send messages.");
  }
});

module.exports = transporter;
