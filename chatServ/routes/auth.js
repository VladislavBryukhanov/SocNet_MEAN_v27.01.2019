const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const User = require('../models/user');
const secret = require('../secret');
const avatarFileSize = require('../common/imageFiles/imagesSize').avatarFileSize;
const maxFileSize = require('../common/imageFiles/imagesSize').maxFileSize;
const resizeAndSaveImage = require('../common/imageFiles/imageActions').resizeAndSaveImage;
const deleteAttachedFiles = require('../common/imageFiles/imageActions').deleteAttachedFiles;

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: maxFileSize
});

const getToken = (user) => {
    const payload = {
        "role": user.role,
        "_id": user._id,
        "session_hash": user.session_hash
    };
    return {
        token: jwt.sign(payload, secret, {expiresIn: 365 * 24 * 60 * 60})
    };
};


router.get('/getProfile', async (request, response) => {
    const user = await User.findOne({
        _id: request.user._id,
        role: request.user.role,
        session_hash: request.user.session_hash
    }).populate('avatar');
    if (user) {       response.send(user);
    } else {
       response.sendStatus(401);
    }
});

router.post('/signIn', async (request, response) => {
    const user = await User.findOne(request.body);
    if(user) {
        const session_hash_data = await User.findOne(request.body).select('session_hash');
        user.session_hash = session_hash_data.session_hash;
        response.send(getToken(user));
    } else {
        response.sendStatus(401);
    }
});

router.post('/signUp', async (request, response) => {
    request.body.session_hash = crypto.randomBytes(20).toString('hex');
    const user = await User.create(request.body);
    if(user) {
        response.send(getToken(user));
    } else {
        response.sendStatus(404);
    }
});

router.put('/editProfile', upload.single('avatar'), async (request, response) => {
    const oldProfile = await User.findOne({_id: request.user._id}).populate('avatar');

    if(request.file) {
        const [avatar] = await resizeAndSaveImage([request.file], 'avatars/', avatarFileSize);
        request.body.avatar = avatar;

        if (oldProfile.avatar) {
            const {fileName} = oldProfile.avatar;
            if(fileName !== 'default.jpg') {
                deleteAttachedFiles([oldProfile.avatar], avatarFileSize);
            }
        }
    }
    // else {
    //     delete request.body.avatar;
    // }
    if(request.body.password) {
        request.body.session_hash = crypto.randomBytes(20).toString('hex');
    }

    const newProfile = await User.findOneAndUpdate(
        {_id: request.user._id},
        request.body,
        {new: true, runValidators: true}
    ).populate('avatar');

    if(newProfile) {
        // TODO if password was change reset session_hash
        // const session_hash_data = await User.findOne(request.body).select('session_hash');
        // newProfile.session_hash = session_hash_data.session_hash;
        // response.send(authPayload(newProfile));
        response.send(newProfile);
    } else {
        response.sendStatus(404);
    }
});

module.exports = router;
