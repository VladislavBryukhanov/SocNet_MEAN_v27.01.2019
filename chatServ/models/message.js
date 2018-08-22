var mongoose = require('mongoose');
var messageSchema = mongoose.Schema({
    username: String,
    content: String,
    time: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model('Message', messageSchema);