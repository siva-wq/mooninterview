const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Interview = require('./models/Interview');
const Notification = require('./models/Notification');
const Question = require('./models/Question');
const Result = require('./models/Result');
const WaitingRoom = require('./models/WaitingRoom');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB connection error:\n", error);
    process.exit(1);
  }
};


const insertMockData = async () => {

    try {

        await connectDB();

        // =========================
        // EXISTING ADMIN
        // =========================
        // Already موجود in DB
        // We will NOT delete admins

        // =========================
        // DELETE OLD MOCK DATA
        // =========================

        await Interview.deleteMany({});
        await Notification.deleteMany({});
        await Question.deleteMany({});
        await Result.deleteMany({});
        await WaitingRoom.deleteMany({});

        // Delete only candidates
        await User.deleteMany({ role: 'candidate' });

        // =========================
        // GET ADMIN
        // =========================

        const admin = await User.findOne({ role: 'admin' });

        if (!admin) {
            console.log('No admin found');
            process.exit();
        }

        // =========================
        // CREATE CANDIDATES
        // =========================

        const candidates = await User.insertMany([
            {
                name: 'Rahul Sharma',
                email: 'rahul@example.com',
                password: '123456',
                role: 'candidate',
            },
            {
                name: 'Priya Reddy',
                email: 'priya@example.com',
                password: '123456',
                role: 'candidate',
            },
            {
                name: 'Arjun Kumar',
                email: 'arjun@example.com',
                password: '123456',
                role: 'candidate',
            },
            {
                name: 'Sneha Patel',
                email: 'sneha@example.com',
                password: '123456',
                role: 'candidate',
            },
            {
                name: 'Kiran Rao',
                email: 'kiran@example.com',
                password: '123456',
                role: 'candidate',
            }
        ]);

        // =========================
        // CREATE INTERVIEWS
        // =========================

        const interviews = await Interview.insertMany([
            {
                title: 'Frontend Developer Interview',
                interviewer: admin._id,
                candidate: candidates[0]._id,
                status: 'scheduled',
                date: new Date('2026-05-25T10:00:00'),
                meetingLink: 'https://meet.google.com/frontend123'
            },

            {
                title: 'Backend Developer Interview',
                interviewer: admin._id,
                candidate: candidates[1]._id,
                status: 'waiting',
                date: new Date('2026-05-25T11:00:00'),
                meetingLink: 'https://meet.google.com/backend123'
            },

            {
                title: 'MERN Stack Interview',
                interviewer: admin._id,
                candidate: candidates[2]._id,
                status: 'started',
                date: new Date('2026-05-25T12:00:00'),
                meetingLink: 'https://meet.google.com/mern123'
            },

            {
                title: 'React Developer Interview',
                interviewer: admin._id,
                candidate: candidates[3]._id,
                status: 'completed',
                date: new Date('2026-05-24T09:00:00'),
                meetingLink: 'https://meet.google.com/react123'
            }
        ]);

        // =========================
        // CREATE QUESTIONS
        // =========================

        await Question.insertMany([

            {
                question: 'Explain React Virtual DOM',
                category: 'React',
                difficulty: 'easy'
            },

            {
                question: 'What is JWT authentication?',
                category: 'Backend',
                difficulty: 'medium'
            },

            {
                question: 'Explain Event Loop in JavaScript',
                category: 'JavaScript',
                difficulty: 'medium'
            },

            {
                question: 'Difference between SQL and NoSQL',
                category: 'Database',
                difficulty: 'easy'
            },

            {
                question: 'Explain system design for chat application',
                category: 'System Design',
                difficulty: 'hard'
            }
        ]);

        // =========================
        // CREATE WAITING ROOMS
        // =========================

        await WaitingRoom.insertMany([
            {
                candidate: candidates[0]._id,
                interview: interviews[0]._id,
                camera: true,
                microphone: true,
                screenShare: false,
                ready: true
            },

            {
                candidate: candidates[1]._id,
                interview: interviews[1]._id,
                camera: true,
                microphone: false,
                screenShare: false,
                ready: false
            },

            {
                candidate: candidates[2]._id,
                interview: interviews[2]._id,
                camera: true,
                microphone: true,
                screenShare: true,
                ready: true
            }
        ]);

        // =========================
        // CREATE RESULTS
        // =========================

        await Result.insertMany([
            {
                candidate: candidates[3]._id,
                interview: interviews[3]._id,
                score: 85,
                feedback: 'Good React knowledge and communication.',
                status: 'selected'
            },

            {
                candidate: candidates[2]._id,
                interview: interviews[2]._id,
                score: 60,
                feedback: 'Needs improvement in backend concepts.',
                status: 'pending'
            },

            {
                candidate: candidates[1]._id,
                interview: interviews[1]._id,
                score: 40,
                feedback: 'Poor problem solving skills.',
                status: 'rejected'
            }
        ]);

        // =========================
        // CREATE NOTIFICATIONS
        // =========================

        await Notification.insertMany([

            {
                user: candidates[0]._id,
                message: 'Your interview is scheduled for tomorrow.'
            },

            {
                user: candidates[1]._id,
                message: 'Please join the waiting room 10 minutes early.'
            },

            {
                user: candidates[2]._id,
                message: 'Interview has started.'
            },

            {
                user: admin._id,
                message: 'A new candidate has joined the waiting room.'
            }
        ]);

        console.log('Mock Data Inserted Successfully');

        process.exit();

    } catch (error) {

        console.log(error);

        process.exit(1);
    }
};

insertMockData();