const express = require('express');
const router = express.Router();
const Chat = require('../models/chat');

router.get('/getChatList', async (request, response) => {
    const populate = request.query.populate;
    let chatList = Chat.find({
        users: { '$in': [request.user._id] }
    });

    if (populate) {
        chatList = await chatList
            .populate({
                path: 'users',
                populate: { path: 'avatar' }
            });
    } else {
        chatList = await chatList;
    }
    
    response.send(chatList);
});

router.get('/findChatByInterlocutor/:interlocutor', async (request, response) => {
    const chat = await Chat.find({
        users: { '$all': [
            request.params.interlocutor,
            request.user._id
        ] }
    });
    response.send(chat);
});

router.get('/getChat/:id', async (request, response) => {
    const chat = await Chat.findOne({ _id: request.params.id})
        .populate({
            path: 'users',
            populate: { path: 'avatar' }
        });

    response.send(chat);
});

router.post('/createChat', async (request, response) => {
    const { interlocutorIds: users } = request.body;
    const newChat = await Chat.create({ users });

    await Chat.populate(newChat, {
        path: 'users',
        populate: { path: 'avatar' }
    });

    response.send(newChat);
});

module.exports = router;