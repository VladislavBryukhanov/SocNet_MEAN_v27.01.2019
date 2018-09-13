const Message = require('../models/message');

const getMessages = (clientSocket, roomId) => {
    Message.find({roomId: roomId}, (err, data) => {
        if (err) {
            console.log(err);
        }
        clientSocket.emit('messages', data);
    });
};

const saveMessages = (msg, callback) => {
    let message = Message(msg);
    message.save(callback);
};

module.exports = (server) => {
    const io = require('socket.io')(server, {
        path: '/chat',
        pingInterval: 10000,
        pingTimeout: 5000,
        origins: '*:*'
    });

    let onlineCounter = 0;

    const leaveRoom = (client) => {
        client.leave(client.room);
        delete client.room;
        io.emit('newConnection', --onlineCounter);
    };

    io.on('connection', (client) => {

    /*    const getRoomOnline = (io, roomId) => {
            console.log(io.sockets.adapter);
            let onlineCounter = (io.sockets.adapter.rooms[roomId]).length;
            io.to(roomId).emit('newConnection', onlineCounter);
        };*/

        client.on('joinRoom', (roomId) => {
            client.join(roomId);
            client.room = roomId;
            io.to(roomId).emit('newConnection', ++onlineCounter);
            getMessages(client, roomId);//, roomId);
            // getRoomOnline(roomId);
        });

        client.on('message', (msg) => {
            saveMessages(msg, (err, msg) => {
                if (err) {
                    console.log(err);
                }
                io.to(client.room).emit('message', msg)
            });
        });

        // client.on('disconnect', client => {
            // getRoomOnline(client.room);
            // console.log(io.sockets.clients(client.roomId));
        // });

        client.on('disconnecting', () => {
            console.log(client.room);
            if(client.room) {
                leaveRoom(client);
            }
        });

        client.on('leaveRoom', () => {
            leaveRoom(client);
     /*       client.leave(roomId);
            delete client.room;
            io.emit('newConnection', --onlineCounter);*/
        });

    });
};
