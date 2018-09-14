const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
    owner: String,
    content: String,
    files: [String]
});

module.exports = blogSchema;