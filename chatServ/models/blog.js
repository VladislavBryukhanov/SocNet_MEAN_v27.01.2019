const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const blogSchema = mongoose.Schema({
    owner: {
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
    },
    rate: [{ type: ObjectId, ref: 'Rate' }],
    comments: [{ type: ObjectId, ref: 'Comment' }]
});

module.exports = mongoose.model("Blog", blogSchema);
