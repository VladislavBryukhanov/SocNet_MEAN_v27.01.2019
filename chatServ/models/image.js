const mongoose = require('mongoose');
const imageSchema = mongoose.Schema({
    fileName: {
        type: String,
        required: true
    },
    filePath: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Image', imageSchema);