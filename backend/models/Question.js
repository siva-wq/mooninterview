const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({

    question:{
        type:String,
        required:true,
    },

    category:{
        type:String,
    },

    difficulty:{
        type:String,
        enum:['easy','medium','hard'],
    }

},{timestamps:true});

module.exports = mongoose.model('Question', questionSchema);