const express = require('express');
const router = express.Router();

const authMiddleware =
    require('../middleware/authMiddleware');


const Interview =
    require('../models/Interview');

const checkOrganisationExpiry = require('../middleware/checkOrganisationExpiry');

router.use(checkOrganisationExpiry);


// ==========================================
// JOIN WAITING ROOM
// ==========================================
router.post(
    '/waiting/join',
    authMiddleware,
    async (req, res) => {

        try {

            const {
                roomId
            } = req.body;

            if (!roomId) {
                return res.status(400).json({
                    message:
                        'Room ID is required'
                });
            }

            const interview =
                await Interview.findOne({
                    roomId: roomId,
                    organisation:
                        req.user.organisation
                });

            if (!interview) {
                return res.status(404).json({
                    message:
                        'Room not found'
                });
            }

            res.status(200).json({
                success: true,
                message:
                    'Candidate joined waiting room',
                interview
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
// ==========================================
router.post(
    '/waiting/permissions',
    authMiddleware,
    async (req, res) => {

        try {

            const {
                camera,
                microphone,
                screenShare,
                resume
            } = req.body;

            if (
                camera &&
                microphone &&
                screenShare &&
                resume
            ) {

                return res.status(200).json({
                    success: true,
                    message:
                        'All permissions granted'
                });
            }

            return res.status(400).json({
                success: false,
                message:
                    'Permissions missing'
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

            if (
                !candidateId ||
                typeof ready !== 'boolean'
            ) {
                return res.status(400).json({
                    message:
                        'Candidate ID and ready status are required'
                });
            }

            const interview =
                await Interview.findOne({
                    candidate: candidateId,
                    organisation:
                        req.user.organisation
                });

            if (!interview) {

                return res.status(404).json({
                    message:
                        'Interview not found'
                });
            }

            interview.ready = ready;

            await interview.save();

            res.status(200).json({
                success: true,
                message:
                    ready
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
