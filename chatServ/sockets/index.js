var Message = require('../models/message');

var getMessages = (clientSocket) => {
    Message.find({}, (err, data) => {
        clientSocket.emit('messages', data);
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
            let message = Message(msg);
            // console.log(message);
            message.save((err)=>{
                console.log(err)
            });
           client.broadcast.emit('message', msg)
        });
    })
};