const mongoose = require('mongoose');

const waitingRoomSchema = new mongoose.Schema({

    candidate:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },

    interview:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Interview',
    },

    camera:{
        type:Boolean,
        default:false,
    },

    microphone:{
        type:Boolean,
        default:false,
    },

    screenShare:{
        type:Boolean,
        default:false,
    },

    ready:{
        type:Boolean,
        default:false,
    }

},{timestamps:true});

module.exports = mongoose.model('WaitingRoom', waitingRoomSchema);