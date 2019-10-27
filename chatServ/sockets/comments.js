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

    io.on('connection', (client) => {

        // custom nodejs event. Passed from http router /comment on each endpoint
        event.on(COMMENT_ADDED, (comment) =>
            io.to(client.room).emit(COMMENT_ADDED, comment));
        
        event.on(COMMENT_CHANGED, (comment) => 
            io.to(client.room).emit(COMMENT_CHANGED, comment));

        event.on(COMMENT_REMOVED, (comment) => 
            io.to(client.room).emit(COMMENT_REMOVED, comment));

        // socket.io event
        client.on('joinCommentsRoom', (postId) => {
            client.join(postId);
            client.room = postId;
        });
    });
};

module.exports.commentEvent = event;