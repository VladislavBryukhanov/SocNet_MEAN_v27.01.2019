const express = require('express');
const router = express.Router();
const User = require('../models/user');
const crypto = require('crypto');
const authPayload = require('../modules/tokenPayload');

router.get('/autoSignIn', async (request, response) => {
    let user = await User.findOne({
        _id: request.user._id,
        role: request.user.role,
        session_hash: request.user.session_hash
    });
    if (user) {
       response.send(user);
    } else {
       response.sendStatus(401);
    }

});

router.post('/signIn', async (request, response) => {
    let user = await User.findOne(request.body);
    if(user) {
        let session_hash_data = await User.findOne(request.body).select('session_hash');
        user.session_hash = session_hash_data.session_hash;
        response.send(authPayload(user));
    } else {
        response.sendStatus(401);
    }
});

router.post('/signUp', async (request, response) => {
    request.body.session_hash = crypto.randomBytes(20).toString('hex');
    let user = await User.create(request.body);
    if(user) {
        response.send(authPayload(user));
    } else {
        response.sendStatus(404);
    }
});

module.exports = router;
module.authPayload = authPayload;
