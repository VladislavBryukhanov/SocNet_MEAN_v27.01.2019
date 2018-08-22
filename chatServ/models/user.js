var mongoose = require('mongoose');
var roomSchema = mongoose.Schema({
    username: String,
    // role: String
});
module.exports = mongoose.model("User", roomSchema);