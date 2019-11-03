const express = require('express');
const router = express.Router();
const Chat = require('../models/chat');

router.get("/getChatList", async (request, response) => {
    return await Chat.find({
        users: { "$in": request.user._id }
    });
});

module.exports = router;