const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // STARTTLS
  auth: {
    user: process.env.BREVO_LOGIN,
    pass: process.env.BREVO_SMTP_KEY,
  },
  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000,
});

const sendEmail = async (to, subject, html) => {
  try {
    // Verify SMTP connection
    await transporter.verify();
    console.log("Brevo SMTP Connected Successfully");

    await transporter.sendMail({
      from: `"MoonInterview" <${process.env.GOOGLE_EMAIL}>`,
      to,
      subject,
      html,
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.error("Email Error:", error);
    throw error;
  }
};

module.exports = sendEmail;
