const express = require('express');
const router = express.Router();
const Chat = require('../models/chat');

router.get('/getChatList', async (request, response) => {
    const chatList = await Chat.find({
        users: { '$in': request.user._id }
    });
    response.send(chatList);
});

router.post('/createChat', async (request, response) => {
    const newChat = await Chat.create(request.body);
    response.send(newChat);
});

module.exports = router;