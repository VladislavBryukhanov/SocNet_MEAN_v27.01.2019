const mongoose = require('mongoose');
const roomSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        select: false
    },
    username: String,
    login: {
        type: String,
        unique: true,
        // required: true
    },
    password: {
        type: String,
        select: false
    },
    role: {
        type: String,
        default: 'user'
    },
    __v: {
        type: Number,
        select: false
    }
});
module.exports = mongoose.model("User", roomSchema);