const express = require('express');
const router = express.Router();

const Interview = require('../models/Interview');

const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');


// ==========================================
// CREATE INTERVIEW
// ADMIN OR INTERVIEWER
// ==========================================
router.post(
    '/interviews',
    authMiddleware,
    roleMiddleware('admin', 'interviewer'),
    async (req, res) => {

        try {

            const {
                candidate,
                interviewer,
                date,
                roomId
            } = req.body;

            const newInterview = new Interview({
                candidate,
                interviewer,
                date,
                roomId,
                status: 'scheduled'
            });

            await newInterview.save();

            res.status(201).json({
                message: 'Interview created successfully',
                interview: newInterview
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
// GET ALL INTERVIEWS
// LOGGED-IN USERS
// ==========================================
router.get(
    '/interviews',
    authMiddleware,
    async (req, res) => {

        try {

            const interviews = await Interview.find()
                .populate('candidate', 'name email')
                .populate('interviewer', 'name email');

            res.status(200).json(interviews);

        } catch (error) {

            console.log(error);

            res.status(500).json({
                message: 'Server Error'
            });
        }
    }
);


// ==========================================
// GET SINGLE INTERVIEW
// LOGGED-IN USERS
// ==========================================
router.get(
    '/interviews/:id',
    authMiddleware,
    async (req, res) => {

        try {

            const interview = await Interview.findById(req.params.id)
                .populate('candidate', 'name email')
                .populate('interviewer', 'name email');

            if (!interview) {

                return res.status(404).json({
                    message: 'Interview not found'
                });
            }

            res.status(200).json(interview);

        } catch (error) {

            console.log(error);

            res.status(500).json({
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
    authMiddleware,
    roleMiddleware('admin', 'interviewer'),
    async (req, res) => {

        try {

            const {
                status,
                feedback,
                result
            } = req.body;

            const updatedInterview =
                await Interview.findByIdAndUpdate(
                    req.params.id,
                    {
                        status,
                        feedback,
                        result
                    },
                    {
                        new: true
                    }
                );

            if (!updatedInterview) {

                return res.status(404).json({
                    message: 'Interview not found'
                });
            }

            res.status(200).json({
                message: 'Interview updated successfully',
                interview: updatedInterview
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
// DELETE INTERVIEW
// ONLY ADMIN
// ==========================================
router.delete(
    '/interviews/:id',
    authMiddleware,
    roleMiddleware('admin'),
    async (req, res) => {

        try {

            const deletedInterview =
                await Interview.findByIdAndDelete(
                    req.params.id
                );

            if (!deletedInterview) {

                return res.status(404).json({
                    message: 'Interview not found'
                });
            }

            res.status(200).json({
                message: 'Interview deleted successfully'
            });

        } catch (error) {

            console.log(error);

            res.status(500).json({
                message: 'Server Error'
            });
        }
    }
);


module.exports = router;