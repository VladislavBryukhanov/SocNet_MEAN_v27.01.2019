const express = require('express');
const router = express.Router();
const User = require('../models/user');
const path = require('path');

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

router.post('/editProfile', upload.single('avatar'), async (request, response) => {
    if(request.file) {
        request.body.avatar = `avatars/${request.file.filename}`;
    }
    // else {
    //     delete request.body.avatar;
    // }
    console.log(request.body);
    let newProfile = await User.findOneAndUpdate({_id: request.user._id}, request.body, {new: true, runValidators: true});
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