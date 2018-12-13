const mongoose = require('mongoose');
const imageSchema = mongoose.Schema({
    fileName: {
        type: String,
        required: true
    },
    filePath: {
        type: {
            type: String,
            required: true
        }
    }
});

module.exports = mongose.model('Image', imageSchema);