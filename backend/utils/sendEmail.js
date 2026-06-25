const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GOOGLE_EMAIL,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000,
});

console.log("Email:", process.env.GOOGLE_EMAIL);
console.log("Password exists:", !!process.env.GOOGLE_APP_PASSWORD);

const sendEmail = async (to, subject, html) => {
  try {
    // Verify SMTP connection
    await transporter.verify();
    console.log("SMTP Connected Successfully");

    await transporter.sendMail({
      from: process.env.GOOGLE_EMAIL,
      to,
      subject,
      html,
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.error("Email Error:", error);
  }
};

module.exports = sendEmail;
