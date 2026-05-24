const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({

    candidate:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },

    interview:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Interview',
    },

    score:{
        type:Number,
    },

    feedback:{
        type:String,
    },

    status:{
        type:String,
        enum:['selected','rejected','pending'],
        default:'pending',
    }

},{timestamps:true});

module.exports = mongoose.model('Result', resultSchema);