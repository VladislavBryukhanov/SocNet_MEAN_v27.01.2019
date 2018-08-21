var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/chat', { useNewUrlParser: true });
module.exports = mongoose.model('Message', {
    username: String,
    content: String,
    time: {
      type: Date,
      default: Date.now
    }
});