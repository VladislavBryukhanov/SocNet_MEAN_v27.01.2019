const chat = require('./chat');
const comments = require('./comments');

module.exports = (server) => {
    chat(server);
    comments(server);
};
