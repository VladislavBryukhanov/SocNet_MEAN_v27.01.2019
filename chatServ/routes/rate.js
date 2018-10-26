const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Rate = require('../models/rate');
const bodyParser = require('body-parser');

const actions = {
  LIKE: 'like',
  DISLIKE: 'dislike'
};

router.get('/getRatedUsers/:itemId&:isPositive&:count&:page', bodyParser.json(), async(request, response) => {
    let itemId = request.params.itemId;
    let isPositive = request.params.isPositive;
    let maxCount = request.params.count;
    let currentPage = request.params.page;

    let usersId = await Rate.find(
        {itemId, isPositive},
        '-_id userId',
        {skip: currentPage * maxCount, limit: maxCount});
    usersId = usersId.map( item => item.userId);

    let users = await User.find({_id: usersId});
    response.send(users);
});

router.get('/getRateCounter/:itemId&:userId', async (request, response) => {
    let itemId = request.params.itemId;
    let userId = request.params.userId;

    let likeCounter = await Rate.count({itemId, isPositive: true});
    let dislikeCounter = await Rate.count({itemId, isPositive: false});
    let myAction = await Rate.findOne({itemId, userId, isPositive: true}) ? actions.LIKE
        : await Rate.findOne({itemId, userId, isPositive: false}) ? actions.DISLIKE : null;

    response.send({likeCounter, dislikeCounter, myAction});
});

router.post('/postRate', async (request, response) => {
    let prevRate = await Rate.findOne({
        userId: request.body.userId,
        itemId: request.body.itemId
    });
    if (prevRate) {
        if (prevRate.isPositive !== request.body.isPositive) {
            request.body.lastState = prevRate.isPositive;
            response.send(await Rate.findOneAndUpdate({_id: prevRate._id}, request.body,
                { upsert: true, new: true, setDefaultsOnInsert: true }));
        } else {
            response.send(await Rate.findOneAndRemove({_id: prevRate._id}));
        }
    } else {
        response.send(await Rate.create(request.body));
    }
});

module.exports = router;
