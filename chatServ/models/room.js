var mongoose = require('mongoose');
var roomSchema = mongoose.Schema({
    access: String,
    visitorsId: [Number]
});
module.exports = mongoose.model("Room", roomSchema);