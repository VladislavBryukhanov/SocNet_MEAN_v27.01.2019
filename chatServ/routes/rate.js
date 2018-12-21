const express = require('express');
const router = express.Router();
const Rate = require('../models/rate');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const findWithPaging = require('../common/paging');

const actions = {
  LIKE: 'like',
  DISLIKE: 'dislike'
};

router.get('/getRatedUsers/:itemId&:isPositive&:limit&:offset', bodyParser.json(), async (request, response) => {
    const itemId = request.params.itemId;
    const isPositive = request.params.isPositive;
    const populate = {
        path: 'user',
        populate: {path: 'avatar'}
    };
    const res = await findWithPaging(request.params, Rate, {itemId, isPositive}, populate);
    res.data = res.data.map( item => item.user );
    res.data.length > 0 ? response.send(res) : response.sendStatus(404);
});

router.get('/getRateCounter/:itemId&:userId', async (request, response) => {
    const itemId = request.params.itemId;
    const user = mongoose.Types.ObjectId(request.params.userId);

    const likeCounter = await Rate.count({itemId, isPositive: true});
    const dislikeCounter = await Rate.count({itemId, isPositive: false});
    const myAction = await Rate.findOne({itemId, user, isPositive: true}) ? actions.LIKE
        : await Rate.findOne({itemId, user, isPositive: false}) ? actions.DISLIKE : null;

    response.send({likeCounter, dislikeCounter, myAction});
});

router.post('/postRate', async (request, response) => {
    request.body.user = mongoose.Types.ObjectId(request.body.userId);
    const prevRate = await Rate.findOne({
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
