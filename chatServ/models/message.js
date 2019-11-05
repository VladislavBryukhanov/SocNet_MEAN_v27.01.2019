const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const messageSchema = mongoose.Schema({
    chatId: {
        type: ObjectId,
        ref: 'Chat',
        required: true
    },
    user: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    attachedFiles: [{
        type: ObjectId,
        ref: 'Image',
        required: true
    }],
    textContent: String,
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Message', messageSchema);