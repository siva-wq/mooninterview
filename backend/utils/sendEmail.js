const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GOOGLE_EMAIL,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});

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
