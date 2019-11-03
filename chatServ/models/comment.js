const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const commentSchema = mongoose.Schema({
    user: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    textContent: {
        type: String,
        default: ''
    },
    attachedFiles: [{
        type: ObjectId,
        ref: 'Image',
        required: true
    }],
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Comment", commentSchema);

