const mongoose = require('mongoose');
const roomSchema = mongoose.Schema({
    avatar: {
        type: String,
        default: 'avatars/giphy.gif'
    },
    username: String,
    login: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        required: true,
        type: String,
        select: false
    },
    // session_hash: {
    //     type: String,
    //     select: false
    // },
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
