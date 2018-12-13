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
    }
});

module.exports = mongoose.model("Blog", blogSchema);
