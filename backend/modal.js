const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    loggedIn: {
        type: Boolean,
        default: false,
    },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;