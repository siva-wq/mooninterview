const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GOOGLE_EMAIL,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});

const sendEmail = async (to, subject, html) => {
  try{
  await transporter.sendMail({
    from: process.env.GOOGLE_EMAIL,
    to,
    subject,
    html,
  });


  console.log("Email sent successfully");
}
catch(error) {
  console.error("Error sending email:", error);
}
};

module.exports = sendEmail;