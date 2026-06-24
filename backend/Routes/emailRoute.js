const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const sendEmail = require('../utils/sendEmail');

const checkOrganisationExpiry = require('../middleware/checkOrganisationExpiry');

const {
  getInterviewInvitationTemplate,
  getSelectedTemplate,
  getHoldTemplate,
  getRejectedTemplate,
} = require('../utils/EmailTemplate');


router.use(authMiddleware)
router.use(checkOrganisationExpiry);

router.post(
  '/send',
  async (req, res) => {
    try {

      const {
        name,
        email,
        date,
        time,
        roomId,
        type,
      } = req.body;

      if (
        !name ||
        !email ||
        !date ||
        !time ||
        !roomId ||
        !type
      ) {
        console.log("Missing fields:", { name, email, date, time, roomId, type });
        return res.status(400).json({
          success: false,
          message: 'All fields are required',
        });
      }

      const formattedDate = new Date(date)
        .toLocaleDateString(
          'en-IN',
          {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }
        );

      const organisationName =
        req.user.organisationName ||
        'Organisation';

      let subject = '';
      let html = '';

      switch (type) {

        case 'Interview-invitation':

          subject = 'Interview Scheduled';

          html =
            getInterviewInvitationTemplate({
              name,
              organisationName,
              formattedDate,
              time,
              roomId,
              frontendUrl: process.env.FRONTEND_URL,
            });

          break;

        case 'selected':

          subject =
            `Congratulations! Selected by ${organisationName}`;

          html =
            getSelectedTemplate({
              name,
              organisationName,
            });

          break;

        case 'hold' || 'pending':

          subject =
            `Application Under Review - ${organisationName}`;

          html =
            getHoldTemplate({
              name,
              organisationName,
            });

          break;

        case 'rejected':

          subject =
            `Application Update - ${organisationName}`;

          html =
            getRejectedTemplate({
              name,
              organisationName,
            });

          break;

        default:

          return res.status(400).json({
            success: false,
            message: 'Invalid email type',
          });
      }

      await sendEmail(
        email,
        subject,
        html
      );

      return res.status(200).json({
        success: true,
        message: 'Email sent successfully',
      });

    } catch (error) {

      console.error(
        'Email Send Error:',
        error
      );

      return res.status(500).json({
        success: false,
        message: 'Server Error',
      });
    }
  }
);

module.exports = router;

