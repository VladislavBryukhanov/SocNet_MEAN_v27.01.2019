const express = require('express');
const router = express.Router();
const Chat = require('../models/chat');
const { CHAT_CREATED } = require('../common/constants').sseEvents;
const { chatEvent } = require('../routes/sse');

const findChatByInterlocutors = (users) => Chat.find({
    users: { '$all': users }
});

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
    const chat = await findChatByInterlocutors([
        request.user._id,
        request.params.interlocutor
    ]);
    
    if (!chat) {
        response.send(404);
    }
    response.send(chat);
});

router.get('/getChat/:id', async (request, response) => {
    const chat = await Chat.findOne({ _id: request.params.id})
        .populate({
            path: 'users',
            populate: { path: 'avatar' }
        });

    if (!chat) {
        response.send(404);
    }
    response.send(chat);
});

router.post('/createChat', async (request, response) => {
    const { interlocutorIds: users } = request.body;

    const chat = await findChatByInterlocutors(users);
    if (chat && chat.length) {
        return response
            .status(400)
            .send('Chat already exists');
    }

    const newChat = await Chat.create({ users });
    await Chat.populate(newChat, {
        path: 'users',
        populate: { path: 'avatar' }
    });

    chatEvent.emit(CHAT_CREATED, newChat);
    response.send(newChat);
});

module.exports = router;