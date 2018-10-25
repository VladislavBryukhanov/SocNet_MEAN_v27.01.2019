const express = require('express');
const router = express.Router();
const Rate = require('../models/rate');

router.get('/getRate/:itemId', async (request, response) => {
    let itemId = request.params.itemId;
    response.send(await Rate.find({itemId}));
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
