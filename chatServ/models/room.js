const mongoose = require('mongoose');

const roomSchema = mongoose.Schema({
    name: String,
    access: String,
});
module.exports = mongoose.model("Room", roomSchema);