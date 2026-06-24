const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },

    password: {
        type: String,
        required: true,
    },

    organisation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organisation',
        required: true,
    },

    role: {
        type: String,
        enum: ['admin', 'candidate', 'interviewer'],
        default: 'candidate',
    },

    active: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('User', userSchema);