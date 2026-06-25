const axios = require("axios");

const sendEmail = async (to, subject, html) => {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "MoonInterview",
          email: process.env.GOOGLE_EMAIL, // Must be a verified sender in Brevo
        },
        to: [
          {
            email: to,
          },
        ],
        subject,
        htmlContent: html,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Email sent:", response.data);
  } catch (error) {
    console.error(
      "Brevo Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

module.exports = sendEmail;
