const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const Organisation = require('../models/Organisation');
const authMiddleware = require('../middleware/authMiddleware');

// REGISTER ADMIN
router.post('/register', async (req, res) => {

    try {

        const {
            name,
            email,
            password,
            role,
            organisation
        } = req.body;

        // Check organisation exists
        const organisationExists =
            await Organisation.findById(organisation);
        const OrganisationName = organisationExists?.title;

        if (!organisationExists) {
            return res.status(404).json({
                message: 'Organisation not found'
            });
        }

        // Check email already exists
        const existingUser =
            await User.findOne({
                email: email.toLowerCase().trim()
            });

        if (existingUser) {
            return res.status(400).json({
                message: 'Email already exists'
            });
        }

        // Check organisation already has admin
        const existingAdmin =
            await User.findOne({
                organisation,
                role: 'admin'
            });

        if (existingAdmin && role === 'admin') {
            return res.status(400).json({
                message:
                    'Admin already exists for this organisation'
            });
        }

        // Hash password
        const hashedPassword =
            await bcrypt.hash(password, 10);

        // Create admin
        const user = await User.create({
            name,
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            organisation,
            OrganisationName,
            role: role
        });

        res.status(201).json({
            message: `${role} registered successfully`,
            userId: user._id
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: 'Server Error'
        });
    }
});
router.post('/login', async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;

        const user = await User
            .findOne({
                email: email.toLowerCase().trim()
            })
            .populate('organisation');

        if (!user) {
            return res.status(400).json({
                message: 'Invalid credentials'
            });
        }

        if (!user.active) {
            return res.status(403).json({
                message: 'Account disabled'
            });
        }

        const isMatch =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!isMatch) {
            return res.status(400).json({
                message: 'Invalid credentials'
            });
        }
        console.log(user);

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role,
                organisation: user.organisation._id,
                organisationName: user.organisation.title
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1h'
            }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                organisation: user.organisation,
                organisationName: user.organisation.title
            }
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: 'Server Error'
        });
    }
});

router.post("/create-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        message: "Password is required.",
      });
    }

    // Verify JWT
    let decoded;

    try {
      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );
    } catch (err) {
      return res.status(400).json({
        message: "Invalid or expired link.",
      });
    }

    // Ensure token purpose is correct
    if (decoded.purpose !== "create-password") {
      return res.status(400).json({
        message: "Invalid invitation link.",
      });
    }

    console.log(decoded)

    // Find candidate
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({
        message: "Candidate not found.",
      });
    }

    // Password already created
    if (user.passwordSet) {
      return res.status(400).json({
        message: "Password has already been created.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save password
    user.password = hashedPassword;
    user.passwordSet = true;

    await user.save();

    return res.status(200).json({
      message: "Password created successfully.",
      roomId: decoded.roomId,
    });

  } catch (err) {
    console.error("Create Password Error:", err);

    return res.status(500).json({
      message: "Internal server error.",
    });
  }
});

router.get(
    '/me',
    authMiddleware,
    async (req, res) => {

        try {

            const user =
                await User.findById(
                    req.user.id
                )
                .select('-password')
                .populate('organisation');

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
module.exports = router;