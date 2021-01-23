const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
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
        unique: true,
        lowercase: true,
        validate: async function(value) {
            if (!validator.isEmail(value))
                throw new Error('Invalid email')
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
        trim: true,
        validate(value) {

        }
    },
    age: {
        type: Number,
        default: 0
    },
    tokens: [{
        token: {
            type: String,
            require: true,
        }
    }]
});

userSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = await jwt.sign({ _id: user._id.toString() }, 'newtoken');
    user.tokens.push({ token });
    await user.save();
    return token;
}

userSchema.statics.findByCreds = async(email, password) => {
    const user = await User.findOne({ email });
    if (!user)
        throw new Error('Unable to login');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
        throw new Error('Unable to login');
    return user;
}

userSchema.pre('save', async function(next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next()
})

const User = mongoose.model('User', userSchema);

module.exports = User;