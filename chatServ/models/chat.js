const mongoose = require('mongoose');

const chatSchema = mongoose.Schema({
    name: String,
    access: String,
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }]
});

module.exports = mongoose.model("Chat", chatSchema);