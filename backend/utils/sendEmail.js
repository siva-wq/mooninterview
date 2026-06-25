const brevo = require("@getbrevo/brevo");

const apiInstance = new brevo.TransactionalEmailsApi();

apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

const sendEmail = async (to, subject, html) => {
  try {
    await apiInstance.sendTransacEmail({
      sender: {
        name: "MoonInterview",
        email: process.env.GOOGLE_EMAIL, // Must be a verified sender in Brevo
      },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.error("Brevo API Error:", error);
    throw error;
  }
};

module.exports = sendEmail;
