const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    avatar: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image',
        default: "5c424df45f69105460b52caf"
        // db.images.insert({"_id" : ObjectId("5c12c5b44ad0e0209b5e6f67"), "filePath" : "avatars/", "fileName" : "default.jpg", "__v" : 0})
        // TODO fix id
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

// const setDefault = function (next) {
//     console.log('test0');
//     console.log(this.avatar, 'test0');
//     console.log(this, 'test0');
//     if (!this.avatar) {
//         console.log('test');
//         this.avatar = {
//             fileName: 'default.jpg',
//             filePath: 'avatars/'
//         };
//     }
//     next();
// };
//
// userSchema.
//     pre('findOne', setDefault).
//     pre('find', setDefault);

module.exports = mongoose.model("User", userSchema);
