const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
    name: String,
    description: String,
    content: String,
    date: String,
    image: String,
    views: [
        {
            userWatched: {type: mongoose.Schema.Types.ObjectId, ref: "User"}
        },
    ],
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    category: {type: mongoose.Schema.Types.ObjectId, ref: "category"},
    comments: [
        {
            content: String,
            date: String,
            user: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
        },
    ],
    key: Number,
});

module.exports = mongoose.model('blog', BlogSchema);
