var mongoose = require('mongoose');
var roomSchema = mongoose.Schema({
    username: String,
    login: String,
    password: String,
    role: {
        type: String,
        default: 'user'
    }
});
module.exports = mongoose.model("User", roomSchema);