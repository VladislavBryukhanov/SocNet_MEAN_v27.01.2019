const mongoose = require('mongoose');
const roomSchema = mongoose.Schema({
    avatar: {
        type: String,
        default: 'avatars/2.png'
    },
    username: String,
    login: {
        type: String,
        // required: true
    },
    password: {
        type: String,
        select: false
    },
    role: {
        type: String,
        default: 'user',
    },
    __v: {
        type: Number,
        select: false
    }
});
module.exports = mongoose.model("User", roomSchema);