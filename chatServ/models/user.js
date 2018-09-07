const mongoose = require('mongoose');
const roomSchema = mongoose.Schema({
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