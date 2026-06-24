const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const checkOrganisationExpiry = require("../middleware/checkOrganisationExpiry");

const Interview = require("../models/Interview");
const Result = require("../models/Result");



router.post(
  "/setres",
  authMiddleware,
  checkOrganisationExpiry,
  async (req, res) => {

    try {

      const {
        roomId,
        status,
        feedback,
      } = req.body;

      if (
        !roomId ||
        !status
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Room ID and status are required",
        });
      }

      const interview =
        await Interview.findOne({
          roomId,
        });

      if (!interview) {
        return res.status(404).json({
          success: false,
          message:
            "Interview not found",
        });
      }

      let result =
        await Result.findOne({
          interview:
            interview._id,
        });

      // UPDATE EXISTING RESULT

      if (result) {

        result.status =
          status;

        result.feedback =
          feedback || "";

        await result.save();

      }

      // CREATE NEW RESULT

      else {

        result =
          await Result.create({

            interview:
              interview._id,

            candidate:
              interview.candidate,

            admin:
              req.user.id,

            status,

            feedback:
              feedback || "",

          });

      }

      // UPDATE INTERVIEW
      if(status === "hold") {
        interview.result="pending";
      }else{
        interview.result = status;
      }

      interview.status =
        "completed";

      await interview.save();

      return res.status(200).json({

        success: true,

        message:
          "Result saved successfully",

        result,

      });

    } catch (error) {

      console.error(error);

      return res.status(500).json({

        success: false,

        message:
          "Server Error",

      });

    }

  }
);

module.exports = router;
