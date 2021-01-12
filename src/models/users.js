const mongoose = require('mongoose');
const validator = require('validator');

const User = mongoose.model('User', {
    name: {
        type: String,
        required: true,
        trim: true,
        uppercase: true,
        validate: function(value) {
            if (value.length < 2)
                throw new Error('Length of name must be at least 2 characters');
        }
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        validate: function(value) {
            if (!validator.isEmail(value))
                throw new Error('Invalid email')
        }
    },
    age: {
        type: Number,
        default: 0
    }
});

module.exports = User;