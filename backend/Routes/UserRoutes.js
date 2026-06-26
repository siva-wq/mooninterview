const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Interview = require('../models/Interview');

const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const checkOrganisationExpiry = require('../middleware/checkOrganisationExpiry');


// ==========================================
// GET ALL USERS
// ORGANISATION USERS ONLY
// ==========================================
router.get(
    '/users',
    authMiddleware,
    async (req, res) => {

        try {

            const users = await User.find({
                organisation: req.user.organisation
            })
            .select('-password')
            .populate(
                'organisation',
                'title'
            );

            res.status(200).json(users);

        } catch (error) {

            console.log(error);

            res.status(500).json({
                message: 'Server Error'
            });
        }
    }
);


// ==========================================
// DASHBOARD CARDS
// ORGANISATION ONLY
// ==========================================
router.get(
    '/users/cards',
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

            const totalAdmins =
                await User.countDocuments({
                    organisation,
                    role: 'admin'
                });

            const totalInterviews =
                await Interview.countDocuments({
                    organisation
                });

            res.status(200).json({
                totalUsers,
                totalCandidates,
                totalInterviewers,
                totalAdmins,
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
// GET SINGLE USER
// ORGANISATION ONLY
// ==========================================
router.get(
    '/users/:id',
    authMiddleware,
    async (req, res) => {

        try {

            const user = await User.findOne({
                _id: req.params.id,
                organisation:
                    req.user.organisation
            })
            .select('-password')
            .populate(
                'organisation',
                'title'
            );

            if (!user) {

                return res.status(404).json({
                    message: 'User not found'
                });
            }

            res.status(200).json(user);

        } catch (error) {

            console.log(error);

            res.status(500).json({
                message: 'Server Error'
            });
        }
    }
);


// ==========================================
// UPDATE USER
// ORGANISATION ONLY
// ==========================================
router.put(
    '/users/:id',
    authMiddleware,
    checkOrganisationExpiry,
    roleMiddleware('admin'),
    async (req, res) => {

        try {

            const {
                name,
                email,
                role
            } = req.body;

            const updatedUser =
                await User.findOneAndUpdate(
                    {
                        _id: req.params.id,
                        organisation:
                            req.user.organisation
                    },
                    {
                        name,
                        email,
                        role
                    },
                    {
                        new: true
                    }
                )
                .select('-password');

            if (!updatedUser) {

                return res.status(404).json({
                    message: 'User not found'
                });
            }

            res.status(200).json({
                message:
                    'User updated successfully',
                user: updatedUser
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
// DELETE USER
// ORGANISATION ONLY
// ==========================================
router.delete(
    '/users/:id',
    authMiddleware,
    checkOrganisationExpiry,
    roleMiddleware('admin'),
    async (req, res) => {

        try {

            const deletedUser =
                await User.findOneAndDelete({
                    _id: req.params.id,
                    organisation:
                        req.user.organisation
                });

            if (!deletedUser) {

                return res.status(404).json({
                    message: 'User not found'
                });
            }

            res.status(200).json({
                message:
                    'User deleted successfully'
            });

        } catch (error) {

            console.log(error);

            res.status(500).json({
                message: 'Server Error'
            });
        }
    }
);

router.post("/users/create-candidate", authMiddleware, async (req, res) => {
  try {
    const { name, email } = req.body;

    console.log(req.user)

    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required.",
      });
    }

    const admin = await User.findById(req.user.id);

    if (!admin) {
      return res.status(404).json({
        message: "Admin not found.",
      });
    }

    if (admin.role !== "admin") {
      return res.status(403).json({
        message: "Access denied.",
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Candidate already exists.",
      });
    }

    const candidate = await User.create({
      name,
      email: email.toLowerCase(),
      role: "candidate",
      organisation: admin.organisation,
      password: null,
      passwordSet: false,
    });

    res.status(201).json({
      message: "Candidate created successfully.",
      candidate,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Internal server error.",
    });
  }
});

module.exports = router;
