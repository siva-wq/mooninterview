const emailLayout = ({ subtitle, content }) => {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
      >
      <title>MoonInterview</title>
    </head>

    <body
      style="
        margin:0;
        padding:0;
        background:#f4f7fb;
        font-family:Arial,sans-serif;
      "
    >
      <table
        width="100%"
        cellpadding="0"
        cellspacing="0"
        border="0"
        style="background:#f4f7fb;"
      >
        <tr>
          <td align="center" style="padding:40px 20px;">

            <table
              width="650"
              cellpadding="0"
              cellspacing="0"
              border="0"
              style="
                background:#ffffff;
                border-radius:16px;
                overflow:hidden;
                box-shadow:0 8px 30px rgba(0,0,0,0.08);
              "
            >

              <!-- Header -->
              <tr>
                <td
                  style="
                    background:linear-gradient(135deg,#2563eb,#7c3aed);
                    padding:50px 30px;
                    text-align:center;
                  "
                >
                  <h1
                    style="
                      margin:0;
                      color:#ffffff;
                      font-size:36px;
                      font-weight:700;
                    "
                  >
                    🌙 MoonInterview
                  </h1>

                  <p
                    style="
                      margin-top:12px;
                      color:#e5e7eb;
                      font-size:18px;
                    "
                  >
                    ${subtitle}
                  </p>
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding:40px;">
                  ${content}
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td
                  style="
                    background:#111827;
                    padding:25px;
                    text-align:center;
                  "
                >
                  <p
                    style="
                      margin:0;
                      color:#9ca3af;
                      font-size:13px;
                    "
                  >
                    © 2026 MoonInterview. All Rights Reserved.
                  </p>

                  <p
                    style="
                      margin-top:10px;
                      color:#6b7280;
                      font-size:12px;
                    "
                  >
                    This is an automated email.
                    Please do not reply directly.
                  </p>
                </td>
              </tr>

            </table>

          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
};


const getInterviewInvitationTemplate = ({
  name,
  organisationName,
  formattedDate,
  time,
  roomId,
  frontendUrl,
}) => {
  return emailLayout({
    subtitle: `Your Interview Has Been Scheduled by ${organisationName}`,

    content: `
      <h2
        style="
          margin-top:0;
          color:#111827;
          font-size:28px;
        "
      >
        Hello ${name},
      </h2>

      <p
        style="
          color:#4b5563;
          font-size:16px;
          line-height:1.8;
        "
      >
        We are pleased to inform you that your interview
        has been scheduled successfully by
        <strong>${organisationName}</strong>.
      </p>

      <table
        width="100%"
        cellpadding="0"
        cellspacing="0"
        border="0"
        style="
          margin:30px 0;
          background:#f8fafc;
          border-left:5px solid #2563eb;
          border-radius:10px;
        "
      >
        <tr>
          <td style="padding:25px;">
            <p
              style="
                margin:0 0 15px 0;
                font-size:16px;
                color:#111827;
              "
            >
              📅 <strong>Interview Time:</strong>
              On ${formattedDate} at ${time}
            </p>

            <p
              style="
                margin:0;
                font-size:16px;
                color:#111827;
              "
            >
              💻 <strong>Platform:</strong>
              MoonInterview
            </p>
          </td>
        </tr>
      </table>

      <div
        style="
          text-align:center;
          margin:40px 0;
        "
      >
        <a
          href="${frontendUrl}/login/${roomId}"
          style="
            display:inline-block;
            padding:16px 40px;
            background:linear-gradient(135deg,#2563eb,#7c3aed);
            color:#ffffff;
            font-size:18px;
            font-weight:bold;
            text-decoration:none;
            border-radius:10px;
          "
        >
          Join Interview
        </a>
      </div>

      <div
        style="
          background:#eff6ff;
          padding:25px;
          border-radius:10px;
        "
      >
        <h3
          style="
            margin-top:0;
            color:#1d4ed8;
          "
        >
          Before You Join
        </h3>

        <ul
          style="
            margin:0;
            padding-left:20px;
            color:#4b5563;
            line-height:2;
          "
        >
          <li>Login using your MoonInterview account.</li>
          <li>Ensure your camera and microphone are working properly.</li>
          <li>Use a stable internet connection.</li>
          <li>Join at least 5 minutes before the scheduled time.</li>
          <li>Keep your updated resume ready.</li>
        </ul>
      </div>

      <p
        style="
          margin-top:35px;
          color:#4b5563;
          font-size:16px;
          line-height:1.8;
        "
      >
        After logging in, you will automatically be
        redirected to the waiting room. Once approved by
        your interviewer, you will enter the interview
        session.
      </p>

      <p
        style="
          margin-top:30px;
          color:#111827;
          font-size:16px;
        "
      >
        Best Regards,<br>
        <strong>
          ${organisationName} Interview Team
        </strong>
      </p>
    `,
  });
};

const getSelectedTemplate = ({
  name,
  organisationName,
}) => {
  return emailLayout({
    subtitle: "Application Successful",

    content: `
      <h2
        style="
          margin-top:0;
          color:#111827;
        "
      >
        Congratulations ${name}! 🎉
      </h2>

      <p
        style="
          color:#4b5563;
          font-size:16px;
          line-height:1.8;
        "
      >
        We are delighted to inform you that you have
        successfully cleared the interview process with
        <strong>${organisationName}</strong>.
      </p>

      <p
        style="
          color:#4b5563;
          font-size:16px;
          line-height:1.8;
        "
      >
        The organisation's HR team will contact you
        directly regarding the next steps and onboarding
        process.
      </p>

      <div
        style="
          background:#ecfdf5;
          padding:25px;
          border-left:5px solid #10b981;
          border-radius:10px;
          margin:30px 0;
        "
      >
        <strong>
          Status: Selected
        </strong>
      </div>

      <p
        style="
          color:#111827;
          font-size:16px;
        "
      >
        Best Regards,<br>
        <strong>
          ${organisationName} Recruitment Team
        </strong>
      </p>
    `,
  });
};

const getHoldTemplate = ({
  name,
  organisationName,
}) => {
  return emailLayout({
    subtitle: "Application Under Review",

    content: `
      <h2
        style="
          margin-top:0;
          color:#111827;
        "
      >
        Hello ${name},
      </h2>

      <p
        style="
          color:#4b5563;
          font-size:16px;
          line-height:1.8;
        "
      >
        Thank you for participating in the interview
        process with
        <strong>${organisationName}</strong>.
      </p>

      <p
        style="
          color:#4b5563;
          font-size:16px;
          line-height:1.8;
        "
      >
        Your application is currently under review.
        Our recruitment team is carefully evaluating
        all candidates before making a final decision.
      </p>

      <div
        style="
          background:#fefce8;
          padding:25px;
          border-left:5px solid #eab308;
          border-radius:10px;
          margin:30px 0;
        "
      >
        <strong>
          Status: Under Review
        </strong>
      </div>

      <p
        style="
          color:#111827;
          font-size:16px;
        "
      >
        Best Regards,<br>
        <strong>
          ${organisationName} Recruitment Team
        </strong>
      </p>
    `,
  });
};

const getRejectedTemplate = ({
  name,
  organisationName,
}) => {
  return emailLayout({
    subtitle: "Application Update",

    content: `
      <h2
        style="
          margin-top:0;
          color:#111827;
        "
      >
        Hello ${name},
      </h2>

      <p
        style="
          color:#4b5563;
          font-size:16px;
          line-height:1.8;
        "
      >
        Thank you for taking the time to interview with
        <strong>${organisationName}</strong>.
      </p>

      <p
        style="
          color:#4b5563;
          font-size:16px;
          line-height:1.8;
        "
      >
        After careful consideration, we regret to
        inform you that we will not be moving forward
        with your application for this opportunity.
      </p>

      <div
        style="
          background:#fef2f2;
          padding:25px;
          border-left:5px solid #ef4444;
          border-radius:10px;
          margin:30px 0;
        "
      >
        <strong>
          Status: Not Selected
        </strong>
      </div>

      <p
        style="
          color:#4b5563;
          font-size:16px;
          line-height:1.8;
        "
      >
        We appreciate your interest and encourage you
        to apply for future opportunities that match
        your skills and experience.
      </p>

      <p
        style="
          color:#111827;
          font-size:16px;
        "
      >
        Best Regards,<br>
        <strong>
          ${organisationName} Recruitment Team
        </strong>
      </p>
    `,
  });
};

module.exports = {
  getInterviewInvitationTemplate,
  getSelectedTemplate,
  getHoldTemplate,
  getRejectedTemplate,
};
