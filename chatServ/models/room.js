var mongoose = require('mongoose');
var roomSchema = mongoose.Schema({
    name: String,
    access: String,
});
module.exports = mongoose.model("Room", roomSchema);