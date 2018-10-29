const express = require('express');
const router = express.Router();
const Rate = require('../models/rate');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const actions = {
  LIKE: 'like',
  DISLIKE: 'dislike'
};

router.get('/getRatedUsers/:itemId&:isPositive&:count&:page', bodyParser.json(), async(request, response) => {
    let itemId = request.params.itemId;
    let isPositive = request.params.isPositive;
    let maxCount = request.params.count;
    let currentPage = request.params.page;

    let users = await Rate.find({itemId, isPositive})
        .sort({date: -1})
        .skip(currentPage * maxCount)
        .limit(maxCount)
        .populate('user');
    users = users.map( item => item.user);
    response.send(users);
});

router.get('/getRateCounter/:itemId&:userId', async (request, response) => {
    let itemId = request.params.itemId;
    let user = mongoose.Types.ObjectId(request.params.userId);

    let likeCounter = await Rate.count({itemId, isPositive: true});
    let dislikeCounter = await Rate.count({itemId, isPositive: false});
    let myAction = await Rate.findOne({itemId, user, isPositive: true}) ? actions.LIKE
        : await Rate.findOne({itemId, user, isPositive: false}) ? actions.DISLIKE : null;

    response.send({likeCounter, dislikeCounter, myAction});
});

router.post('/postRate', async (request, response) => {
    request.body.user = mongoose.Types.ObjectId(request.body.userId);
    let prevRate = await Rate.findOne({
        user: mongoose.Types.ObjectId(request.body.userId),
        itemId: request.body.itemId
    });
    if (prevRate) {
        if (prevRate.isPositive !== request.body.isPositive) {
            request.body.lastState = prevRate.isPositive;
            response.send(await Rate.findOneAndUpdate({_id: prevRate._id}, request.body,
                { upsert: true, new: true, setDefaultsOnInsert: true }));
        } else {
            response.send(await Rate.findOneAndDelete({_id: prevRate._id}));
        }
    } else {
        response.send(await Rate.create(request.body));
    }
});

module.exports = router;
