var express = require('express');
var router = express.Router();
var User = require('../models/user');

var secret = require('../secret');
var jwt = require('jsonwebtoken');

const addUser = (userData) => {
    let user = new User(userData);
    return user.save();
};

const searchUser = (auth) => {
    return User.findOne(auth);
};

router.post('/signIn', async (request, response) => {
    let res = await searchUser(request.body);
    if(res) {
        let sessionPayload = {
            role: res.role,
            id: res._id
        };
        let token = jwt.sign(sessionPayload, secret, { expiresIn: 365 * 24 * 60 * 60 });
        console.log(res);
        response.send(token);
    } else {
        response.sendStatus(401);
    }
});

router.post('/signUp', async (request, response) => {
    let res = await addUser(request.body);
    if(res) {
        let sessionPayload = {
            role: res.role,
            id: res._id
        };
        let token = jwt.sign(sessionPayload, secret, { expiresIn: 365 * 24 * 60 * 60 });
        response.send(token);
    } else {
        response.sendStatus(500);
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
