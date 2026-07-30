const Interview = require("../models/Interview");

const interviewSocket = (io) => {

    io.on('connection', (socket) => {

        console.log(
            'User Connected:',
            socket.id
        );


        // ==========================================
        // ADMIN WAITING ROOM
        // ==========================================
        socket.on(
            'admin_waiting_room',
            ({ organisationId }) => {

                const room =
                    `admin_waiting_room_${organisationId}`;

                socket.join(room);

                console.log(
                    `Admin joined ${room}`
                );
            }
        );


        // ==========================================
        // JOIN INTERVIEW ROOM
        // ==========================================
        socket.on(
            'join_room',
            ({ roomId }) => {

                socket.join(roomId);

                console.log(
                    `Joined Room: ${roomId}`
                );

                io.to(roomId).emit(
                    'notification',
                    {
                        type: 'info',
                        message:
                            'A user joined the interview room'
                    }
                );
            }
        );


        // ==========================================
        // WEBRTC OFFER
        // ==========================================
        socket.on(
            'offer',
            ({ roomId, offer, type }) => {

                socket.to(roomId).emit(
                    'offer',
                    {
                        offer,
                        type
                    }
                );
            }
        );


        // ==========================================
        // WEBRTC ANSWER
        // ==========================================
        socket.on(
            'answer',
            ({ roomId, answer, type }) => {

                socket.to(roomId).emit(
                    'answer',
                    {
                        answer,
                        type
                    }
                );
            }
        );


        // ==========================================
        // WEBRTC ICE CANDIDATE
        // ==========================================
        socket.on(
            'ice_candidate',
            ({ roomId, candidate, type }) => {

                socket.to(roomId).emit(
                    'ice_candidate',
                    {
                        candidate,
                        type
                    }
                );
            }
        );


        // ==========================================
        // SCREEN SHARE STARTED
        // ==========================================
        socket.on(
            'screen_share_started',
            ({ roomId }) => {

                io.to(roomId).emit(
                    'notification',
                    {
                        type: 'info',
                        message:
                            'Screen sharing started'
                    }
                );

                socket.to(roomId).emit(
                    'screen_share_started'
                );
            }
        );


        // ==========================================
        // SCREEN SHARE STOPPED
        // ==========================================
        socket.on(
            'screen_share_stopped',
            ({ roomId }) => {

                io.to(roomId).emit(
                    'notification',
                    {
                        type: 'warning',
                        message:
                            'Screen sharing stopped'
                    }
                );

                socket.to(roomId).emit(
                    'screen_share_stopped'
                );
            }
        );


        // ==========================================
        // CANDIDATE READY
        // ==========================================
        socket.on(
            'candidate_ready',
            ({
                roomId,
                candidateId,
                organisationId
            }) => {

                io.to(
                    `admin_waiting_room_${organisationId}`
                ).emit(
                    'candidate_ready_status',
                    {
                        candidateId,
                        roomId,
                        organisationId,
                        ready: true
                    }
                );

                console.log(
                    `Candidate Ready: ${candidateId}`
                );
            }
        );


        // ==========================================
        // START INTERVIEW
        // ==========================================
        socket.on(
            'start_interview',
            async ({ roomId }) => {

                const interview =
                    await Interview.findOne({
                        roomId
                    });

                    if(!interview) {
                        console.log("Interview not found");
                        io.to(roomId).emit(
                    'notification',
                    {
                        type: 'error',
                        message:
                            'Interview not found'
                    }
                );
                        return;
                    }

                    if (!interview.startTime) {

                        interview.startTime = new Date();
                        interview.status = "ongoing";

                        await interview.save();
                    }

                io.to(roomId).emit(
                    'notification',
                    {
                        type: 'success',
                        message:
                            'Interview has started'
                    }
                );


                io.to(roomId).emit(
                    'interview_started',
                    {
                        started: true,
                        roomId
                    }
                );

            }
        );

        //admin toggled candidate mic
        socket.on("candidateToggle", ({ roomId, enable }) => {
            socket.to(roomId).emit("candidateMicToggled", {
                enabled: enable,
            });
        });

        //admin toggled code editor
        socket.on("toggle_code_editor", ({ roomId, enabled }) => {
            socket.to(roomId).emit("toggle_code_editor", {
                enabled: enabled,
            });
        });


        // ==========================================
        // END INTERVIEW
        // ==========================================
        socket.on(
            "end_interview",
            async ({ roomId }) => {

                await Interview.findOneAndUpdate(
                    { roomId },
                    {
                        endTime: new Date(),
                        status: "completed",
                    }
                );

                io.to(roomId).emit(
                    "interview_ended"
                );

            }
        );

        // ==========================================
        // NEW INTERVIEW CREATED
        // ==========================================
        socket.on(
            'new_interview',
            ({
                organisationId,
                date
            }) => {

                io.to(
                    `admin_waiting_room_${organisationId}`
                ).emit(
                    'notification',
                    {
                        type: 'info',
                        message:
                            `New interview scheduled for ${date}`
                    }
                );
            }
        );


        // ==========================================
        // CHAT MESSAGE
        // ==========================================
        socket.on(
            'send_message',
            ({
                roomId,
                sender,
                message
            }) => {

                io.to(roomId).emit(
                    'receive_message',
                    {
                        sender,
                        message
                    }
                );
            }
        );


        // ==========================================
        // TAB SWITCH DETECTION
        // ==========================================
        socket.on(
            'tab_switch',
            ({
                roomId,
                candidateName
            }) => {

                io.to(roomId).emit(
                    'notification',
                    {
                        type: 'warning',
                        message:
                            `${candidateName} switched tabs`
                    }
                );
            }
        );


        // ==========================================
        // FULLSCREEN EXIT DETECTION
        // ==========================================
        socket.on(
            'fullscreen_exit',
            ({
                roomId,
                candidateName
            }) => {

                io.to(roomId).emit(
                    'notification',
                    {
                        type: 'warning',
                        message:
                            `${candidateName} exited fullscreen mode`
                    }
                );
            }
        );


        // ==========================================
        // CAMERA OFF DETECTION
        // ==========================================
        socket.on(
            "camera_status",
            ({ roomId, enabled }) => {

                socket.to(roomId).emit(
                    "camera_status",
                    {
                        enabled
                    }
                );
            }
        );

        socket.on(
            "mic_status",
            ({ roomId, enabled }) => {

                socket.to(roomId).emit(
                    "mic_status",
                    {
                        enabled
                    }
                );
            }
        );


        // ==========================================
        // CODE RUN
        // ==========================================
        socket.on(
            'code_run',
            ({
                roomId,
                language
            }) => {

                io.to(roomId).emit(
                    'notification',
                    {
                        type: 'info',
                        message:
                            `Code executed in ${language}`
                    }
                );
            }
        );


        // ==========================================
        // ADMIN READY
        // ==========================================
        socket.on(
            'admin_ready',
            ({ roomId }) => {

                socket.to(roomId).emit(
                    'request_offer'
                );
            }
        );


        // ==========================================
        // AI QUESTION GENERATED
        // ==========================================
        socket.on(
            'ai_question_generated',
            ({ roomId }) => {

                io.to(roomId).emit(
                    'notification',
                    {
                        type: 'success',
                        message:
                            'AI generated new interview questions'
                    }
                );
            }
        );


        // ==========================================
        // DISCONNECT
        // ==========================================
        socket.on(
            'disconnect',
            () => {

                console.log(
                    'User Disconnected:',
                    socket.id
                );
            }
        );

    });
};

module.exports = interviewSocket;
