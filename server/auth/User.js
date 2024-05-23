const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: String,
    full_name: String,
    password: String,
    image: String,
    hobby: String,
    isAdmin: Boolean,
    toNote: [{type: mongoose.Schema.Types.ObjectId, ref: "blog"}],
    isBlocked: Boolean,
    githubId: String,
    googleId: String,
})

module.exports = mongoose.model('User', UserSchema);