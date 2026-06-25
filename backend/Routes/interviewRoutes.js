const express = require('express');
const router = express.Router();

const { v4: uuidv4 } = require('uuid');

const Interview = require('../models/Interview');

const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const checkOrganisationExpiry = require('../middleware/checkOrganisationExpiry');


router.use(authMiddleware);
router.use(checkOrganisationExpiry);


//validate
router.get("/validate/:roomId", async (req, res) => {
  try {
    const { roomId } = req.params;

    const interview = await Interview.findOne({
      roomId,
    }).populate("organisation");

    // Interview not found
    if (!interview) {
      return res.status(404).json({
        type: "invalid",
        message: "Interview not found",
      });
    }

    // Organisation not found
    if (!interview.organisation) {
      return res.status(404).json({
        type: "invalid",
        message: "Organisation not found",
      });
    }

    // ✅ Interview already completed
    if (interview.status === "completed") {
      return res.status(403).json({
        type: "completed",
        message: "Interview already completed",
      });
    }

    // Link expiry check
    const interviewDateTime = new Date(
      `${interview.date.toISOString().split("T")[0]} ${interview.time}`
    );

    const expiryTime =
      interviewDateTime.getTime() + 60 * 60 * 1000;

    if (Date.now() > expiryTime) {
      return res.status(410).json({
        type: "expired",
        message: "Interview link expired",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Interview validated",
      interview: {
        roomId: interview.roomId,
        title: interview.title,
        status: interview.status,
        organisation: interview.organisation,
      },
    });
  } catch (error) {
    console.error("Validate Interview Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});


// ==========================================
// CREATE INTERVIEW
// ADMIN OR INTERVIEWER
// ==========================================

router.get(
    '/interview/:roomId',
    async (req, res) => {

        try {

            const interview =
                await Interview.findOne({
                    roomId: req.params.roomId
                });

            if (!interview) {

                return res.status(404).json({
                    message: 'Interview not found'
                });
            }

            // Candidate can only access own interview
            if (
                req.user.role === 'candidate' &&
                interview.candidate.toString() !== req.user.id
            ) {

                return res.status(403).json({
                    message: 'Unauthorized'
                });
            }

            // Admin/Interviewer must belong to same organisation
            if (
                (req.user.role === 'admin' ||
                 req.user.role === 'interviewer') &&
                interview.organisation.toString() !==
                req.user.organisation
            ) {

                return res.status(403).json({
                    message: 'Unauthorized'
                });
            }

            return res.status(200).json({
                success: true
            });

        } catch (error) {

            console.error(error);

            return res.status(500).json({
                message: 'Server Error'
            });
        }
    }
);

router.post(
    '/interviews',
    roleMiddleware('admin', 'interviewer'),
    async (req, res) => {

        try {

            const {
                candidate,
                title,
                date,
                time
            } = req.body;

            if (!candidate || !title || !date || !time) {
                return res.status(400).json({
                    message: 'All fields are required'
                });
            }

            const roomId = uuidv4();


            const interview = await Interview.create({

                title,

                candidate,

                interviewer: req.user.id,

                organisation: req.user.organisation,

                roomId,

                date,

                time,

                status: 'scheduled'
            });

            res.status(201).json({
                success: true,
                message: 'Interview created successfully',
                interview
            });

        } catch (error) {

            console.log(error);

            res.status(500).json({
                success: false,
                message: 'Server Error'
            });
        }
    }
);


// ==========================================
// GET ALL INTERVIEWS
// ORGANISATION ONLY
// ==========================================
router.get(
    '/interviews',
    async (req, res) => {

        try {

            const interviews = await Interview
                .find({
                    organisation: req.user.organisation
                })
                .populate(
                    'candidate',
                    'name email'
                )
                .populate(
                    'interviewer',
                    'name email'
                )
                .populate(
                    'organisation',
                    'title'
                )
                .sort({
                    createdAt: -1
                });

            res.status(200).json(interviews);

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                message: 'Server Error'
            });
        }
    }
);


// ==========================================
// GET SINGLE INTERVIEW
// ORGANISATION ONLY
// ==========================================
router.get(
    '/interviews/:id',
    async (req, res) => {

        try {

            const interview = await Interview
                .findOne({
                    _id: req.params.id,
                    organisation:
                        req.user.organisation
                })
                .populate(
                    'candidate',
                    '_id name email'
                )
                .populate(
                    'interviewer',
                    '_id name email'
                )
                .populate(
                    'organisation',
                    'title'
                );

            if (!interview) {
                return res.status(404).json({
                    message: 'Interview not found'
                });
            }

            res.status(200).json(interview);

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                message: 'Server Error'
            });
        }
    }
);


// ==========================================
// GET INTERVIEW BY ROOM ID
// PUBLIC
// ==========================================
router.get(
    '/room/:roomId',
    async (req, res) => {

        try {

            const interview = await Interview
                .findOne({
                    roomId: req.params.roomId
                })
                .populate(
                    'candidate',
                    'name email'
                )
                .populate(
                    'interviewer',
                    'name email'
                )
                .populate(
                    'organisation',
                    'title'
                );

            if (!interview) {
                return res.status(404).json({
                    message: 'Interview not found'
                });
            }

            res.status(200).json(interview);

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                message: 'Server Error'
            });
        }
    }
);


// ==========================================
// UPDATE INTERVIEW
// ADMIN OR INTERVIEWER
// ==========================================
router.put(
    '/interviews/:id',
    roleMiddleware('admin', 'interviewer'),
    async (req, res) => {

        try {

            const {
                status,
                feedback,
                result,
                ready
            } = req.body;



            const interview =
                await Interview.findOneAndUpdate(
                    {
                        _id: req.params.id,
                        organisation:
                            req.user.organisation
                    },
                    {
                        status,
                        feedback,
                        result,
                        ready
                    },
                    {
                        new: true
                    }
                );

            if (!interview) {
                return res.status(404).json({
                    message: 'Interview not found'
                });
            }

            res.status(200).json({
                success: true,
                message:
                    'Interview updated successfully',
                interview
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                message: 'Server Error'
            });
        }
    }
);


// ==========================================
// UPLOAD RESUME
// ==========================================
router.post(
    '/candidate/update-resume',
    async (req, res) => {
        console.log("Update resume", req.body);

        try {

            const {
                id,
                resumeUrl
            } = req.body;

            if (
                !id ||
                !resumeUrl
            ) {
                console.log("Missing required fields", {
                    id,
                    resumeUrl
                });
                return res.status(400).json({
                    success: false,
                    message:
                        'Interview ID and Resume URL are required'
                });
            }

            const interview =
                await Interview.findOneAndUpdate(
                    {
                        candidate: id,
                        organisation:
                            req.user.organisation
                    },
                    {
                        resume: resumeUrl
                    },
                    {
                        new: true
                    }
                );

            if (!interview) {
                console.log("Interview not found");
                return res.status(404).json({
                    success: false,
                    message:
                        'Interview not found'
                });
            }

            res.status(200).json({
                success: true,
                interview
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
);


// ==========================================
// DELETE INTERVIEW
// ADMIN ONLY
// ==========================================
router.delete(
    '/interviews/:id',
    roleMiddleware('admin'),
    async (req, res) => {

        try {

            const interview =
                await Interview.findOneAndDelete(
                    {
                        _id: req.params.id,
                        organisation:
                            req.user.organisation
                    }
                );

            if (!interview) {
                return res.status(404).json({
                    message: 'Interview not found'
                });
            }

            res.status(200).json({
                success: true,
                message:
                    'Interview deleted successfully'
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                message: 'Server Error'
            });
        }
    }
);

module.exports = router;

