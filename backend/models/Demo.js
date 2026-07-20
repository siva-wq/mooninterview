const mongoose =
    require('mongoose');

const DemoSchema =
    new mongoose.Schema({
      
        name: {

            type: String,

            required: true,
        },

         email: {

            type: String,

            required: true,
        },

         organisation: {

            type: String,

            required: true,
        },

        date: {

            type: Date,
        },
        time: String,

    },
        {
            timestamps: true
        });


module.exports = mongoose.model('Demo', DemoSchema);