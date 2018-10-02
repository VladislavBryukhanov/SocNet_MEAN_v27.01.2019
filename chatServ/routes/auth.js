const express = require('express');
const router = express.Router();
const _ = require('lodash');
const User = require('../models/user');

const secret = require('../secret');
const jwt = require('jsonwebtoken');

const addUser = (userData) => {
    return User.create(userData);
};

const searchUser = (auth) => {
    return User.findOne(auth);
};

const authPayload = (user) => {
    let payload = {
        "role": user.role,
        "_id": user._id
    };
    let token = jwt.sign(payload, secret, {expiresIn: 365 * 24 * 60 * 60});

/*    user = user.toObject();
    delete user._id;
    delete user.role;*/

    let res = {
        token: token,
        user: user
    };
    return res;
};

router.get('/autoSignIn', async (request, response) => {
    let user = await searchUser({
        _id: request.user._id,
        role: request.user.role
    });
    if (user) {
       response.send(user);
    } else {
       response.sendStatus(404);
    }

});

router.post('/signIn', async (request, response) => {
    let user = await searchUser(request.body);
    if(user) {
        response.send(authPayload(user));
    } else {
        response.sendStatus(404);
    }
});

router.post('/signUp', async (request, response) => {
    let user = await addUser(request.body);
    user = await searchUser(user);
    if(user) {
        response.send(authPayload(user));
    } else {
        response.sendStatus(404);
    }
});

module.exports = router;
