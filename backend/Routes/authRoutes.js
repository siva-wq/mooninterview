const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

// REGISTER
router.post('/register', async (req, res) => {
    try {

        const { name, email, password, role } = req.body;

        // Check user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role
        });

        await newUser.save();

        res.status(201).json({
            message: 'User registered successfully'
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: 'Server Error'
        });
    }
});


// LOGIN
router.post('/login', async (req, res) => {

    try {

        const { email, password } = req.body;

        // Check user exists
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: 'Invalid Email or Password'
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: 'Invalid Password'
            });
        }

        // Generate JWT Token
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            'mooninterviewsecret',
            {
                expiresIn: '1h'
            }
        );

        res.status(200).json({
            message: 'Login Successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: 'Server Error'
        });
    }
});

// GET CURRENT LOGGED-IN USER
router.get('/me', authMiddleware, async (req, res) => {

    try {

        const user = await User.findById(req.user.id)
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


module.exports = router;