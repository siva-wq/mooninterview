const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    organisation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organisation',
        required: true,
    },

    message:{
        type:String,
    },

    read:{
        type:Boolean,
        default:false,
    }

},{timestamps:true});

module.exports = mongoose.model('Notification', notificationSchema);