var Message = require('../models/message');

var getMessages = (clientSocket) => {
    Message.find({}, (err, data) => {
        if (err) {
            console.log(err);
        }
        clientSocket.emit('messages', data);
    });
};

var saveMessages = (socket, msg) => {
    let message = Message(msg);
    message.save((err, msg)=>{
        if (err) {
            console.log(err);
        }
        socket.emit('message', msg)
    });
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
        console.log('con');
        getMessages(client);
        io.emit('newConnection', ++onlineCounter);

        client.on('disconnect', _ => {
            io.emit('newConnection', --onlineCounter);
        });

        client.on('message', (msg) => {
            saveMessages(io, msg);
        });

        client.on('messageRoom', (msg) => {
            io.to('WWW').emit('cb', msg);
        });

        client.on('join', (msg) => {
            client.join('WWW');
        });
    })
};