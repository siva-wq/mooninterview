const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');


// ==========================================
// JOIN WAITING ROOM
// LOGGED-IN USERS
// ==========================================
router.post(
    '/waiting/join',
    authMiddleware,
    async (req, res) => {

        try {

            const {
                candidateName,
                interviewId
            } = req.body;

            res.status(200).json({
                message: 'Candidate joined waiting room',
                candidateName,
                interviewId,
                user: req.user
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
// CHECK DEVICE PERMISSIONS
// LOGGED-IN USERS
// ==========================================
router.post(
    '/waiting/permissions',
    authMiddleware,
    async (req, res) => {

        try {

            const {
                camera,
                microphone,
                screenShare
            } = req.body;

            if (
                camera &&
                microphone &&
                screenShare
            ) {

                return res.status(200).json({
                    message: 'All permissions granted'
                });
            }

            res.status(400).json({
                message: 'Permissions missing'
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
// CANDIDATE READY STATUS
// LOGGED-IN USERS
// ==========================================
router.post(
    '/waiting/ready',
    authMiddleware,
    async (req, res) => {

        try {

            const {
                candidateId,
                ready
            } = req.body;

            res.status(200).json({
                message: ready
                    ? 'Candidate is ready'
                    : 'Candidate is not ready',
                candidateId
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