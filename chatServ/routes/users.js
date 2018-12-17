const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/getUsers/:count&:page', async(request, response) => {
    const maxCount = Number(request.params.count);
    const currentPage = Number(request.params.page);
    const users = await User.find({}, [], {skip: currentPage * maxCount, limit: maxCount})
        .populate('avatar');
    users.length > 0 ? response.send(users) : response.sendStatus(404);
});

router.get('/getUser/:id', async(request, response) => {
    const user = await User.findOne({_id: request.params.id})
        .populate('avatar');
    if(user) {
        response.send(user);
    } else {
        response.sendStatus(404);
    }
});

module.exports = router;
