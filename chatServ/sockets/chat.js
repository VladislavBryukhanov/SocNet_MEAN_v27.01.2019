const Message = require('../models/message');
const { ObjectId } = require('mongoose').Types;
const jwt = require('jsonwebtoken');
const secret = require('../secret');
const { INCOMING_MESSAGE } = require('../common/constants').sseEvents;
const { chatEvent } = require('../routes/sse');

const socketAuthMiddleware = (socket, next) => {
    const { query } = socket.handshake;

    if (query && query.token) {
        let { token } = query;
        
        // Remove Bearer from string
        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
        }

        jwt.verify(token, secret, (err, decoded) => {
            if(err) {
                socket.disconnect();
                return next(new Error('Auth error'));
            }
            socket.decoded = decoded;
            next();
        })
    } else {
        socket.disconnect();
        return next(new Error('Auth error'));
    }
}

module.exports = (server) => {
    const io = require('socket.io')(server, {
        path: '/chat_soc',
        pingInterval: 10000,
        pingTimeout: 5000,
        origins: '*:*'
    });

    io.use(socketAuthMiddleware)
        .on('connection', (client) => {

            // TODO add paging for message fetcher
            client.on('joinChat', async (chatId) => {
                client.join(chatId);
                client.chatId = chatId;
                const messages = await Message.find({ chatId });
                client.emit('fetchMessages', messages);
            });

            client.on('sendMessage', async (msg, cb) => {
                const { chatId } = client;
                const message = await Message.create({
                    ...msg,
                    user: client.decoded._id,
                    chatId: ObjectId(chatId)
                });
                // const viewMessage = await Message.populate(message, {
                //     path: 'user',
                //     populate: { path: 'avatar' }
                // });

                cb({ exists: !!message });
                io.to(chatId).emit('messageSent', message);
                chatEvent.emit(INCOMING_MESSAGE, { message: message, chatId });
            });
        });
};
