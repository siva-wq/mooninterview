const mongoose = require('mongoose');
require('dotenv').config();
const bcrypt = require('bcryptjs');

const Organisation = require('./models/Organisation');
const User = require('./models/User');
const Interview = require('./models/Interview');
const Notification = require('./models/Notification');
const Question = require('./models/Question');
const Result = require('./models/Result');
const WaitingRoom = require('./models/WaitingRoom');

const connectDB = async () => {
    try {

        await mongoose.connect(
            process.env.MONGO_URI
        );

        console.log(
            'MongoDB Connected'
        );

    } catch (error) {

        console.error(
            'MongoDB connection error:',
            error
        );

        process.exit(1);
    }
};

const insertMockData = async () => {

    try {

        await connectDB();

        console.log(
            'Deleting existing data...'
        );

        // ==========================================
        // DELETE ALL EXISTING DATA
        // ==========================================

        await WaitingRoom.deleteMany({});
        await Result.deleteMany({});
        await Notification.deleteMany({});
        await Question.deleteMany({});
        await Interview.deleteMany({});
        await User.deleteMany({});
        await Organisation.deleteMany({});

        console.log(
            'Existing data deleted'
        );

        // ==========================================
        // CREATE ORGANISATIONS
        // ==========================================

        const organisations =
            await Organisation.insertMany([
                {
                    title:
                        'Moon Technologies',

                    active: true,

                    startDate:
                        new Date(),

                    expiryDate:
                        new Date('2027-12-31')
                },

                {
                    title:
                        'ABC Solutions',

                    active: true,

                    startDate:
                        new Date(),

                    expiryDate:
                        new Date('2027-12-31')
                }
            ]);

        console.log(
            'Organisations created'
        );

        // ==========================================
        // PASSWORD
        // ==========================================

        const hashedPassword =
            await bcrypt.hash(
                '123456',
                10
            );

        // ==========================================
        // CREATE ADMINS
        // ==========================================

        const admins =
            await User.insertMany([
                {
                    name:
                        'Moon Admin',

                    email:
                        'moonadmin@test.com',

                    password:
                        hashedPassword,

                    role:
                        'admin',

                    organisation:
                        organisations[0]._id
                },

                {
                    name:
                        'ABC Admin',

                    email:
                        'abcadmin@test.com',

                    password:
                        hashedPassword,

                    role:
                        'admin',

                    organisation:
                        organisations[1]._id
                }
            ]);

        console.log(
            'Admins created'
        );

        // ==========================================
        // CREATE CANDIDATES
        // ==========================================

        const candidates =
            await User.insertMany([
                {
                    name:
                        'Rahul Sharma',

                    email:
                        'rahul@test.com',

                    password:
                        hashedPassword,

                    role:
                        'candidate',

                    organisation:
                        organisations[0]._id
                },

                {
                    name:
                        'Priya Reddy',

                    email:
                        'priya@test.com',

                    password:
                        hashedPassword,

                    role:
                        'candidate',

                    organisation:
                        organisations[0]._id
                },

                {
                    name:
                        'Arjun Kumar',

                    email:
                        'arjun@test.com',

                    password:
                        hashedPassword,

                    role:
                        'candidate',

                    organisation:
                        organisations[1]._id
                },

                {
                    name:
                        'Sneha Patel',

                    email:
                        'sneha@test.com',

                    password:
                        hashedPassword,

                    role:
                        'candidate',

                    organisation:
                        organisations[1]._id
                }
            ]);

        console.log(
            'Candidates created'
        );

        // ==========================================
        // CREATE INTERVIEWS
        // ==========================================

        const interviews =
            await Interview.insertMany([
                {
                    title:
                        'Frontend Developer Interview',

                    interviewer:
                        admins[0]._id,

                    candidate:
                        candidates[0]._id,

                    organisation:
                        organisations[0]._id,

                    roomId:
                        'moon-room-1',

                    status:
                        'scheduled',

                    date:
                        new Date(),

                    time:
                        '10:00'
                },

                {
                    title:
                        'React Developer Interview',

                    interviewer:
                        admins[0]._id,

                    candidate:
                        candidates[1]._id,

                    organisation:
                        organisations[0]._id,

                    roomId:
                        'moon-room-2',

                    status:
                        'waiting',

                    date:
                        new Date(),

                    time:
                        '11:00'
                },

                {
                    title:
                        'Backend Developer Interview',

                    interviewer:
                        admins[1]._id,

                    candidate:
                        candidates[2]._id,

                    organisation:
                        organisations[1]._id,

                    roomId:
                        'abc-room-1',

                    status:
                        'ongoing',

                    date:
                        new Date(),

                    time:
                        '12:00'
                },

                {
                    title:
                        'Node.js Interview',

                    interviewer:
                        admins[1]._id,

                    candidate:
                        candidates[3]._id,

                    organisation:
                        organisations[1]._id,

                    roomId:
                        'abc-room-2',

                    status:
                        'completed',

                    date:
                        new Date(),

                    time:
                        '13:00',

                    result:
                        'selected'
                }
            ]);

        console.log(
            'Interviews created'
        );

        // ==========================================
        // CREATE QUESTIONS
        // ==========================================

        // ==========================================
// CREATE QUESTIONS
// ==========================================

await Question.insertMany([
    {
        question: 'What is React?',
        category: 'React',
        difficulty: 'easy',
        organisation: organisations[0]._id
    },

    {
        question: 'Explain Virtual DOM',
        category: 'React',
        difficulty: 'medium',
        organisation: organisations[0]._id
    },

    {
        question: 'What is JWT?',
        category: 'Backend',
        difficulty: 'medium',
        organisation: organisations[0]._id
    },

    {
        question: 'Explain Event Loop',
        category: 'JavaScript',
        difficulty: 'medium',
        organisation: organisations[1]._id
    },

    {
        question: 'Difference between SQL and NoSQL',
        category: 'Database',
        difficulty: 'easy',
        organisation: organisations[1]._id
    }
]);

console.log('Questions created');

        // ==========================================
        // CREATE WAITING ROOMS
        // ==========================================

        await WaitingRoom.insertMany([
            {
                candidate:
                    candidates[0]._id,

                interview:
                    interviews[0]._id,

                organisation:
                    organisations[0]._id,

                camera: true,

                microphone: true,

                screenShare: true,

                ready: true
            },

            {
                candidate:
                    candidates[1]._id,

                interview:
                    interviews[1]._id,

                organisation:
                    organisations[0]._id,

                camera: true,

                microphone: true,

                screenShare: false,

                ready: false
            },

            {
                candidate:
                    candidates[2]._id,

                interview:
                    interviews[2]._id,

                organisation:
                    organisations[1]._id,

                camera: true,

                microphone: true,

                screenShare: true,

                ready: true
            }
        ]);

        console.log(
            'Waiting rooms created'
        );

        // ==========================================
        // CREATE RESULTS
        // ==========================================

        await Result.insertMany([
            {
                candidate:
                    candidates[0]._id,

                interview:
                    interviews[0]._id,

                organisation:
                    organisations[0]._id,

                score: 88,

                feedback:
                    'Good React skills',

                status:
                    'selected'
            },

            {
                candidate:
                    candidates[2]._id,

                interview:
                    interviews[2]._id,

                organisation:
                    organisations[1]._id,

                score: 52,

                feedback:
                    'Needs improvement',

                status:
                    'pending'
            },

            {
                candidate:
                    candidates[3]._id,

                interview:
                    interviews[3]._id,

                organisation:
                    organisations[1]._id,

                score: 91,

                feedback:
                    'Excellent performance',

                status:
                    'selected'
            }
        ]);

        console.log(
            'Results created'
        );

        // ==========================================
        // CREATE NOTIFICATIONS
        // ==========================================

        await Notification.insertMany([
    {
        user: candidates[0]._id,
        organisation: organisations[0]._id,
        message: 'Your interview has been scheduled.'
    },

    {
        user: candidates[1]._id,
        organisation: organisations[0]._id,
        message: 'Please join the waiting room.'
    },

    {
        user: candidates[2]._id,
        organisation: organisations[1]._id,
        message: 'Interview is starting soon.'
    },

    {
        user: admins[0]._id,
        organisation: organisations[0]._id,
        message: 'Candidate is ready.'
    }
]);

        console.log(
            '\nMock Data Inserted Successfully'
        );

        console.log(
            '\nAdmin Accounts:'
        );

        console.log(
            'moonadmin@test.com / 123456'
        );

        console.log(
            'abcadmin@test.com / 123456'
        );

        process.exit(0);

    } catch (error) {

        console.error(error);

        process.exit(1);
    }
};

insertMockData();
