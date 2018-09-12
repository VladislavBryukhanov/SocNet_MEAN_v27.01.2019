const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.post('/editProfile', async (request, response) => {
    let newPofile = await User.findOneAndUpdate({_id: request.user._id},request.body);
    if(newPofile) {
        response.send(newPofile);
    } else {
        response.sendStatus(404);
    }
});

module.exports = router;