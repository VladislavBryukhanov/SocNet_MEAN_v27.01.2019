const mongoose = require('mongoose');
const roomSchema = mongoose.Schema({
    avatar: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image',
        default: "5c12c5b44ad0e0209b5e6f67"
        // required: true
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
    bio: {

    },
    gender: {

    },
    // age: {
    //
    // },
    // languages: {
    //
    // },
    // country: {
    //
    // },
    // status: {
    //
    // },
    // education: {
    //
    // },
    // specialty: {
    //
    // },
    __v: {
        type: Number,
        select: false
    }
});
module.exports = mongoose.model("User", roomSchema);

// default: 'avatars/default.jpg'
