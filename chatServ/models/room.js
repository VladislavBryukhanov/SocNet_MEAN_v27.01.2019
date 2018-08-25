var mongoose = require('mongoose');
var roomSchema = mongoose.Schema({
    name: String,
    access: String,
    // visitorsId: [Number]
});
module.exports = mongoose.model("Room", roomSchema);