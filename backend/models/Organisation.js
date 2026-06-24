const mongoose = require('mongoose');

const organisationSchema = new mongoose.Schema(
{
    // ==========================================
    // ORGANISATION NAME
    // ==========================================
    title: {
        type: String,
        required: true,
        trim: true
    },

    // ==========================================
    // STATUS
    // ==========================================
    active: {
        type: Boolean,
        default: true
    },

    // ==========================================
    // START DATE
    // ==========================================
    startDate: {
        type: Date
    },

    // ==========================================
    // EXPIRY DATE
    // ==========================================
    expiryDate: {
        type: Date
    },
    plan: {
        type: String,
        enum: ['free', 'pro', 'enterprise'],
        default: 'free'
    }
},
{
    timestamps: true
});

module.exports = mongoose.model('Organisation', organisationSchema);