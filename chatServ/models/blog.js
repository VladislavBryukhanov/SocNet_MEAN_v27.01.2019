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
    attachedFiles: {
        type: [String],
        default: []
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Blog", blogSchema);
