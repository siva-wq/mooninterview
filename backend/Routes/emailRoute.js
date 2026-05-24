const express = require('express');

const router = express.Router();

const sendEmail = require('../utils/sendEmail');

router.post('/send', async (req, res) => {

  try {

    const { name, email, time } = req.body;

    if (!name || !email || !time) {
      return res.status(400).json({
        message: 'All fields are required'
      });
    }

    const subject = 'Interview Schedule';

    const html = `
      <h2>Hello ${name}</h2>

      <p>Your interview has been scheduled.</p>

      <h3>Interview Time: ${time}</h3>

      <p>Please join on time.</p>

      <p>Best of luck!</p>
    `;

    await sendEmail(email, subject, html);

    res.status(200).json({
      success: true,
      message: 'Email sent successfully'
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: 'Server Error'
    });

  }

});

module.exports = router;