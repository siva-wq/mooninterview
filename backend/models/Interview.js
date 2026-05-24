const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },

    interviewer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },

    candidate:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },

    status:{
        type:String,
        enum:['scheduled','waiting','started','completed'],
        default:'scheduled',
    },

    date:{
        type:Date,
    },

    meetingLink:{
        type:String,
    }

},{timestamps:true});

module.exports = mongoose.model('Interview', interviewSchema);