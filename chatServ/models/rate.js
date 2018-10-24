const mongoose = require('mongoose');
const rateSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    isPositive: {
        type: Boolean,
        required: true
    },
    itemType: {
        type: Number,
        required: true
    },
    itemId: {
        type: String,
        required: true
    },
    lastState: {
        type: Boolean
    }
});

module.exports = rateSchema;
