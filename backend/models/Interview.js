const mongoose =
    require('mongoose');

const interviewSchema =
    new mongoose.Schema({

        // ==========================================
        // INTERVIEW TITLE
        // ==========================================
        title: {

            type: String,

            required: true,
        },


        // ==========================================
        // INTERVIEWER
        // ==========================================
        interviewer: {

            type:
                mongoose.Schema.Types.ObjectId,

            ref: 'User',
        },


        // ==========================================
        // CANDIDATE
        // ==========================================
        candidate: {

            type:
                mongoose.Schema.Types.ObjectId,

            ref: 'User',
        },

        organisation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Organisation',
            required: true,
        },


        // ==========================================
        // UNIQUE ROOM ID (UUID)
        // ==========================================
        roomId: {

            type: String,

            unique: true,
        },
        startTime:{
            type: Date,
            default: null
        },

        endTime:{
            type: Date,
            default: null
        },


        // ==========================================
        // STATUS
        // ==========================================
        status: {

            type: String,

            enum: [
                'scheduled',
                'waiting',
                'started',
                'completed',
                'ongoing'

            ],

            default: 'scheduled',
        },


        // ==========================================
        // INTERVIEW DATE
        // ==========================================
        date: {

            type: Date,
        },
        time: String,

        resume:{
            type:String,
            default:null,
        },


        // ==========================================
        // FEEDBACK
        // ==========================================
        feedback: {

            type: String,
        },

        // ==========================================
        // READY
        // ==========================================
        ready: {
            type: Boolean,
            default: false
        },


        // ==========================================
        // RESULT
        // ==========================================
        result: {

            type: String,

            enum: [
                'selected',
                'rejected',
                'pending',
            ],

            default: 'pending',
        },

    },
        {
            timestamps: true
        });


module.exports = mongoose.model('Interview', interviewSchema);