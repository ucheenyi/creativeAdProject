const mongoose = require('mongoose');

const Person = mongoose.model('Person',
    {
        name: {
            type: String,
            minlength: 1,
            trim: true,
            required: true
        },
        age: {
            type: Number,
            required: true
        },
        sex: {
            type: String,
            enum: ['male', 'female', 'other'],
            minLength: 3,
            required: true
            
        },
        survived: {
            type: Boolean,
            trim: true,
            required: true
        },
        fare: {
            type: Number,
            required: true
        },
        passengerClass: {
            type: Number,
            trim: true,
            required: true
        },
        siblingsOrSpousesAboard: {
            type: Number,
            required: true
        },
        parentsOrChildrenAboard: {
            type: Number,
            required: true
        }
    }
);

// Export model
module.exports = { Person };