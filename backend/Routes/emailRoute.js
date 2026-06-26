const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const sendEmail = require('../utils/sendEmail');

const User=require('../models/User');

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
      const candidate = await User.findOne({
          email: email.toLowerCase(),
      });

      if (!candidate) {
        return res.status(404).json({
          success: false,
          message: "Candidate not found.",
        });
      }
      const jwt = require("jsonwebtoken");

      let createPasswordLink = null;

      if (!candidate.passwordSet) {
        const createPasswordToken = jwt.sign(
          {
            userId: candidate._id,
            roomId,
            purpose: "create-password",
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "24h",
          }
        );

        createPasswordLink =
          `${process.env.FRONTEND_URL}/create-password/${createPasswordToken}`;
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
      const formatTime = (time) => {
  const [hours, minutes] = time.split(":").map(Number);

  return new Date(0, 0, 0, hours, minutes).toLocaleTimeString(
    "en-US",
    {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }
  );
};
      console.log(formatTime(time));

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
                time: formatTime(time),
              roomId,
              frontendUrl: process.env.FRONTEND_URL,
              createPasswordLink,
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

