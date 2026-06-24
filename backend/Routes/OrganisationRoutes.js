const express = require('express');
const router = express.Router();

const Organisation =
    require('../models/Organisation');

const User =
    require('../models/User');

const Interview =
    require('../models/Interview');

const authMiddleware =
    require('../middleware/authMiddleware');

const roleMiddleware =
    require('../middleware/roleMiddleware');



//create organisation
router.post(
    '/organisations',
    authMiddleware,
    roleMiddleware(['admin']),
    async (req, res) => {
        try {
            const { title } = req.body;

            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + 10); // 10-day trial

            const organisation = new Organisation({
                title,
                active: true,
                startDate: new Date(),
                expiryDate
            });


            await organisation.save();

            res.status(201).json({
                organisation
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: 'Server Error'
            });
        }
    }
);


// ==========================================
// GET ALL ORGANISATIONS
// PUBLIC
// ==========================================
router.get(
    '/organisations',
    async (req, res) => {

        try {

            const organisations =
                await Organisation.find({
                    active: true
                })
                .select(
                    '_id title active'
                )
                .sort({
                    title: 1
                });

            res.status(200).json({
                organisations
            });

        } catch (error) {

            console.log(error);

            res.status(500).json({
                message: 'Server Error'
            });
        }
    }
);


// ==========================================
// GET MY ORGANISATION
// ==========================================
router.get(
    '/organisations/me',
    authMiddleware,
    async (req, res) => {

        try {

            const organisation =
                await Organisation.findById(
                    req.user.organisation
                );

            if (!organisation) {
                return res.status(404).json({
                    message:
                        'Organisation not found'
                });
            }

            res.status(200).json(
                organisation
            );

        } catch (error) {

            console.log(error);

            res.status(500).json({
                message: 'Server Error'
            });
        }
    }
);


// ==========================================
// GET ORGANISATION STATS
// ==========================================
router.get(
    '/organisations/stats',
    authMiddleware,
    async (req, res) => {

        try {

            const organisation =
                req.user.organisation;

            const totalUsers =
                await User.countDocuments({
                    organisation
                });

            const totalCandidates =
                await User.countDocuments({
                    organisation,
                    role: 'candidate'
                });

            const totalInterviewers =
                await User.countDocuments({
                    organisation,
                    role: 'interviewer'
                });

            const totalInterviews =
                await Interview.countDocuments({
                    organisation
                });

            res.status(200).json({
                totalUsers,
                totalCandidates,
                totalInterviewers,
                totalInterviews
            });

        } catch (error) {

            console.log(error);

            res.status(500).json({
                message: 'Server Error'
            });
        }
    }
);


// ==========================================
// UPDATE ORGANISATION
// ADMIN ONLY
// ==========================================
router.put(
    '/organisations',
    authMiddleware,
    roleMiddleware('admin'),
    async (req, res) => {

        try {

            const {
                title,
                expiryDate
            } = req.body;

            const organisation =
                await Organisation.findByIdAndUpdate(
                    req.user.organisation,
                    {
                        title,
                        expiryDate
                    },
                    {
                        new: true
                    }
                );

            if (!organisation) {

                return res.status(404).json({
                    message:
                        'Organisation not found'
                });
            }

            res.status(200).json({
                message:
                    'Organisation updated successfully',
                organisation
            });

        } catch (error) {

            console.log(error);

            res.status(500).json({
                message: 'Server Error'
            });
        }
    }
);

//get status
router.get(
  "/organisation-status",
  authMiddleware,
  async (req, res) => {
    try {
      const organisation =
        await Organisation.findById(
          req.user.organisation
        );

      if (!organisation) {
        return res.status(404).json({
          message: "Organisation not found",
        });
      }

      const now = new Date();

      const expired =
        now > organisation.expiryDate;

      const daysLeft = expired
        ? 0
        : Math.ceil(
            (organisation.expiryDate - now) /
              (1000 * 60 * 60 * 24)
          );

      res.json({
        expired,
        daysLeft,
        expiryDate:
          organisation.expiryDate,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

module.exports = router;
