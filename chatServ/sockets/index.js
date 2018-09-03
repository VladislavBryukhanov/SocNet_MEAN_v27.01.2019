var Message = require('../models/message');

var getMessages = (clientSocket, roomId) => {
    Message.find({roomId: roomId}, (err, data) => {
        if (err) {
            console.log(err);
        }
        clientSocket.emit('messages', data);
    });
};

var saveMessages = (msg, callback) => {
    let message = Message(msg);
    message.save(callback);
};

module.exports = (server) => {
    var io = require('socket.io')(server, {
        path: '/chat',
        pingInterval: 10000,
        pingTimeout: 5000,
        orogons: '*:*'
    });

    let onlineCounter = 0;
    io.on('connection', (client) => {

        client.on('joinRoom', (roomId) => {

            client.join(roomId);
            client.room = roomId;
            io.to(roomId).emit('newConnection', ++onlineCounter);
            getMessages(client, roomId);//, roomId);

            // client.on('disconnect', _ => {
                // io.emit('newConnection', --onlineCounter);
            // });
        });

        client.on('message', (msg) => {
            saveMessages(msg, (err, msg) => {
                if (err) {
                    console.log(err);
                }
                io.to(client.room).emit('message', msg)
            });
        });

        client.on('leaveRoom', (roomId) => {
            client.leave(roomId);
            io.emit('newConnection', --onlineCounter);
        });

/*
        console.log('con');
        getMessages(client);
        io.emit('newConnection', ++onlineCounter);

        client.on('disconnect', _ => {
            io.emit('newConnection', --onlineCounter);
        });

        client.on('message', (msg) => {
            saveMessages(io, msg);
        });
*/

/*        client.on('messageRoom', (msg) => {
            io.to('WWW').emit('cb', msg);
        });

        client.on('join', (msg) => {
            client.join('WWW');
        });*/
    })
};