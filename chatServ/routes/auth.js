const express = require('express');
const router = express.Router();
const User = require('../models/user');

const secret = require('../secret');
const jwt = require('jsonwebtoken');

const addUser = (userData) => {
    let user = new User(userData);
    return user.save();
};

const searchUser = (auth) => {
    User.findOne(auth)
        .populate('username', 'name')
        .exec();
};

const authPayload = (user) => {
    let sessionPayload = {
        role: user.role,
        id: user._id
    };
    let token = jwt.sign(sessionPayload, secret, {expiresIn: 365 * 24 * 60 * 60});

    delete user.password;
    delete user._id;
    delete user.role;

    let res = {
        token: token,
        user: user
    };
    return res;
};

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
    if(user) {
        response.send(authPayload(user));
    } else {
        response.sendStatus(404);
    }
});


/*router.get('/test', (request, response) => {
    // console.log(request);
    console.log(request.user);
    response.send("Test");
    // console.log(request.headers);
    // console.log(request.headers.token);
/!*    jwt.verify(request.headers.token, 'password1234', (er, res) => {
        console.log(er);
        console.log(res);
    })*!/
});*/

module.exports = router;
