const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const messageSchema = mongoose.Schema({
    roomId: {
        type: ObjectId,
        ref: 'Room',
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
    content: String,
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Message', messageSchema);