const express = require('express');
const router = express.Router();
const Rate = require('../models/rate');

const itemTypes = {
    post: 1,
    photo: 2,
    comment: 3
};
router.get('/getRate/:itemType&:itemId', async (request, response) => {
    let itemType = request.params.itemType;
    let itemId = request.params.itemId;
    response.send(await Rate.find({itemType, itemId}));
});

router.post('/postRate', async (request, response) => {
    await Rate.create(request.body.rate);
    let itemType = request.params.itemType;
    let itemId = request.params.itemId;
    response.send(await Rate.find({itemType, itemId}));
});
