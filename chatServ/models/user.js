const mongoose = require('mongoose');
const roomSchema = mongoose.Schema({
    avatar: {
        type: String,
        required: true,
        default: 'avatars/default.jpg'
    },
    username: {
        type: String,
        required: true
    },
    login: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    session_hash: {
        type: String,
        required: true,
        select: false
    },
    role: {
        type: String,
        default: 'user',
        required: true
    },
    __v: {
        type: Number,
        select: false
    }
});
module.exports = mongoose.model("User", roomSchema);
