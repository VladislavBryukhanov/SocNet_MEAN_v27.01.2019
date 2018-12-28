const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
    owner: {
        type: String,
        required: true
    },
    textContent: {
        type: String,
        default: ''
    },
    attachedFiles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image',
        required: true
    }],
    date: {
        type: Date,
        default: Date.now
    },
    rate: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Rate' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
});

module.exports = mongoose.model("Blog", blogSchema);
