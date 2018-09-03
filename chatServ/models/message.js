var mongoose = require('mongoose');
var messageSchema = mongoose.Schema({
    username: String,
    content: String,
    time: {
        type: Date,
        default: Date.now
    },
    roomId: {
        type: String,
        required: true
    }
});
module.exports = mongoose.model('Message', messageSchema);