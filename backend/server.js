const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

require('dotenv').config();

const cors = require('cors');

const connectDB = require('./config/db');

const authRoutes = require('./Routes/authRoutes');
const userRoutes = require('./Routes/UserRoutes');
const interviewRoutes = require('./Routes/interviewRoutes');
const waitingRoomRoutes = require('./Routes/waitingRoomRoutes');
const emailRoutes = require('./Routes/emailRoute');
const organisationRoutes = require('./Routes/OrganisationRoutes');
const compilerRoutes = require('./Routes/compilerRoute');
const ResultRoutes = require('./Routes/ResultRoutes');

const interviewSocket = require('./sockets/interviewSocket');

const app = express();


// ==========================================
// CREATE HTTP SERVER
// ==========================================
const server = http.createServer(app);


// ==========================================
// SOCKET.IO SETUP
// ==========================================
const io = new Server(server, {
    cors: {
        origin: '*'
    }
});


// ==========================================
// DATABASE CONNECTION
// ==========================================
connectDB();


// ==========================================
// MIDDLEWARES
// ==========================================
app.use(cors());

app.use(express.json());


// ==========================================
// ROUTES
// ==========================================
app.use('/api/auth', authRoutes);

app.use('/api', userRoutes);

app.use('/api', interviewRoutes);

app.use('/api', waitingRoomRoutes);

app.use('/api', emailRoutes);

app.use('/api', organisationRoutes);

app.use('/api/compiler', compilerRoutes);

app.use('/api/result', ResultRoutes);

app.use('/api', require('./Routes/seedRoutes'));




// ==========================================
// SOCKETS
// ==========================================
interviewSocket(io);


// ==========================================
// TEST ROUTE
// ==========================================
app.get('/', (req, res) => {

    res.send('MoonInterview Backend Running');
});


// ==========================================
// START SERVER
// ==========================================
server.listen(process.env.PORT, () => {

    console.log(
        `Server is running on port ${process.env.PORT}`
    );
});
