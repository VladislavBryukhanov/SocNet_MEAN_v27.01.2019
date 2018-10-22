const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
    owner: String,
    textContent: String,
    attachedFiles: [String],
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Blog", blogSchema);
