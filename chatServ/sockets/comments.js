const {
    COMMENT_ADDED,
    COMMENT_CHANGED,
    COMMENT_REMOVED
} = require('../common/constants').commentEventActions;
const EventEmitter = require('events');
const event = new EventEmitter();

module.exports = (server) => {
    const io = require('socket.io')(server, {
        path: '/comments_soc',
        pingInterval: 10000,
        pingTimeout: 5000,
        origins: '*:*'
    });

    // custom nodejs event. Passed from http router /comment on each endpoint
    event.on(COMMENT_ADDED, ({ itemId, newComment }) =>
        io.to(itemId).emit(COMMENT_ADDED, newComment));
    
    event.on(COMMENT_CHANGED, ({ itemId, newComment }) => 
        io.to(itemId).emit(COMMENT_CHANGED, newComment));

    event.on(COMMENT_REMOVED, ({ itemId, newComment }) => 
        io.to(itemId).emit(COMMENT_REMOVED, newComment));

    io.on('connection', (client) => {
        // socket.io event
        client.on('joinCommentsRoom', (postId) => {
            client.join(postId);
            client.room = postId;
        });
    });
};

module.exports.commentEvent = event;