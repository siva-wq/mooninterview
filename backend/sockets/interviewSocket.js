const interviewSocket = (io) => {

    io.on('connection', (socket) => {

        console.log('User Connected:', socket.id);


        // ==========================================
        // JOIN ROOM
        // ==========================================
        socket.on('join_room', (roomId) => {

            socket.join(roomId);

            console.log(`Joined Room: ${roomId}`);

            io.to(roomId).emit(
                'notification',
                {
                    type: 'info',
                    message: 'A user joined the interview room'
                }
            );
        });


        // ==========================================
        // CANDIDATE READY
        // ==========================================
        socket.on('candidate_ready', (data) => {

            io.to(data.roomId).emit(
                'notification',
                {
                    type: 'success',
                    message: 'Candidate is ready for interview'
                }
            );

            io.to(data.roomId).emit(
                'candidate_ready_status',
                {
                    candidateId: data.candidateId,
                    ready: true
                }
            );
        });


        // ==========================================
        // START INTERVIEW
        // ==========================================
        socket.on('start_interview', (data) => {

            io.to(data.roomId).emit(
                'notification',
                {
                    type: 'success',
                    message: 'Interview has started'
                }
            );

            io.to(data.roomId).emit(
                'interview_started',
                {
                    started: true
                }
            );
        });


        // ==========================================
        // END INTERVIEW
        // ==========================================
        socket.on('end_interview', (data) => {

            io.to(data.roomId).emit(
                'notification',
                {
                    type: 'warning',
                    message: 'Interview has ended'
                }
            );

            io.to(data.roomId).emit(
                'interview_ended',
                {
                    ended: true
                }
            );
        });


        // ==========================================
        // NEW INTERVIEW CREATED
        // ==========================================
        socket.on('new_interview', (data) => {

            io.emit(
                'notification',
                {
                    type: 'info',
                    message: `New interview scheduled for ${data.date}`
                }
            );
        });


        // ==========================================
        // CHAT MESSAGE
        // ==========================================
        socket.on('send_message', (data) => {

            io.to(data.roomId).emit(
                'receive_message',
                {
                    sender: data.sender,
                    message: data.message
                }
            );
        });


        // ==========================================
        // USER DISCONNECT
        // ==========================================
        socket.on('disconnect', () => {

            console.log('User Disconnected:', socket.id);
        });

    });
};

module.exports = interviewSocket;