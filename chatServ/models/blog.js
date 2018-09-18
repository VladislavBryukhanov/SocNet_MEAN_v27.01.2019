const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
    owner: String,
    textContent: String,
    attachedFiles: [String]
});

module.exports = mongoose.model("Blog", blogSchema);