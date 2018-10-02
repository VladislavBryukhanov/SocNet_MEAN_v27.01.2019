const express = require('express');
const router = express.Router();
const User = require('../models/user');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname+ '/../', 'public/avatars'))
    },
    filename: function(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()} ${path.extname(file.originalname)}`)
    }
});
const upload = multer({
    storage: storage,
    limits: {fileSize: 5 * 1024 * 1024}
});
//
router.put('/editProfile', upload.single('avatar'), async (request, response) => {
    let oldProfile = await User.findOne({_id: request.user._id});
    if(request.file) {
        request.body.avatar = `avatars/${request.file.filename}`;
        fs.unlink(`public/${oldProfile.avatar}`, err => console.log(err));
    }
    // else {
    //     delete request.body.avatar;
    // }
    // if(request.body.password) {
    //     request.body.session_hash = crypto.randomBytes(20).toString('hex');
    // }
    let newProfile = await User.findOneAndUpdate(
        {_id: request.user._id},
        request.body,
        {new: true, runValidators: true});

    if(newProfile) {
        response.send(newProfile);
    } else {
        response.sendStatus(404);
    }
});

router.get('/getUsers', async(request, response) => {
    let users = await User.find({});
    response.send(users);
});

router.get('/getUser/:id', async(request, response) => {
    let user = await User.findOne({_id: request.params.id});
    if(user) {
        response.send(user);
    } else {
        response.sendStatus(404);
    }
});

module.exports = router;
