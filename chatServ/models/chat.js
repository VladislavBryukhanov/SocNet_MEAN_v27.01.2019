const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const chatSchema = mongoose.Schema({
    name: String,
    avatar: {
        type: ObjectId,
        ref: 'Image'
    },
    users: [{
        type: ObjectId,
        ref: 'User',
        required: true
    }]
});

module.exports = mongoose.model("Chat", chatSchema);