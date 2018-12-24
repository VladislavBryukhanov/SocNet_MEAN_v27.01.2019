const mongoose = require('mongoose');
const rateSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isPositive: {
        type: Boolean,
        required: true
    },
    lastState: {
        type: Boolean
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Rate", rateSchema);
