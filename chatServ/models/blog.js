const mongoose = require('mongoose');
const Rate = require('./rate');
const Comment = require('./comment');

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
    rate: [Rate.schema],
    comments: [Comment.schema]
});

module.exports = mongoose.model("Blog", blogSchema);
