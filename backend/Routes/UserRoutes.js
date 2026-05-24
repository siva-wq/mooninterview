const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Interview = require('../models/Interview');


// ==========================================
// GET ALL USERS
// ==========================================
router.get('/users', async (req, res) => {

    try {

        const users = await User.find().select('-password');

        res.status(200).json(users);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: 'Server Error'
        });
    }
});


// ==========================================
// DASHBOARD CARDS
// ==========================================
router.get('/users/cards', async (req, res) => {

    try {

        const totalUsers = await User.countDocuments();

        const totalCandidates = await User.countDocuments({
            role: 'candidate'
        });

        const totalInterviewers = await User.countDocuments({
            role: 'interviewer'
        });

        const totalAdmins = await User.countDocuments({
            role: 'admin'
        });

        const totalInterviews = await Interview.countDocuments();

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
});


// ==========================================
// GET SINGLE USER
// ==========================================
router.get('/users/:id', async (req, res) => {

    try {

        const user = await User.findById(req.params.id)
            .select('-password');

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
});


// ==========================================
// UPDATE USER
// ==========================================
router.put('/users/:id', async (req, res) => {

    try {

        const { name, email, role } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                name,
                email,
                role
            },
            {
                new: true
            }
        ).select('-password');

        if (!updatedUser) {

            return res.status(404).json({
                message: 'User not found'
            });
        }

        res.status(200).json({
            message: 'User updated successfully',
            user: updatedUser
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: 'Server Error'
        });
    }
});


// ==========================================
// DELETE USER
// ==========================================
router.delete('/users/:id', async (req, res) => {

    try {

        const deletedUser = await User.findByIdAndDelete(
            req.params.id
        );

        if (!deletedUser) {

            return res.status(404).json({
                message: 'User not found'
            });
        }

        res.status(200).json({
            message: 'User deleted successfully'
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: 'Server Error'
        });
    }
});


module.exports = router;