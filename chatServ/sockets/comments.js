module.exports = (server) => {
    const io = require('socket.io')(server, {
        path: '/comments_soc',
        pingInterval: 10000,
        pingTimeout: 5000,
        origins: '*:*'
    });

    io.on('connection', (client) => {
        client.on('joinCommentsRoom', (postId) => {
            client.join(postId);
            client.room = postId;
        });

        client.on('commentAdded', (comment) => {
            io.to(client.room).emit('commentAdded', comment);
        });
    });
};
