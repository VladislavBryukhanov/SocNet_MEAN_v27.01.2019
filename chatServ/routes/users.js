const express = require('express');
const router = express.Router();
const User = require('../models/user');
const findWithPaging = require('../common/paging');

router.get('/getUsers/:limit&:offset', async(request, response) => {
    const res = await findWithPaging(request.params, User, {}, 'avatar');
    res.data.length > 0 ? response.send(res) : response.sendStatus(404);
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
