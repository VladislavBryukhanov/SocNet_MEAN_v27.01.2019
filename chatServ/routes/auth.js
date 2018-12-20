const express = require('express');
const router = express.Router();
const User = require('../models/user');
const secret = require('../secret');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Image = require('../models/image');
const path = require('path');
const fs = require('fs');
const uuid = require('uuid');
const multer = require('multer');
const sharp = require('sharp');

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {fileSize: 5 * 1024 * 1024}
});

const avatarFileSize = [
    {
        name: 'min',
        size: 50
    },
    {
        name: 'normal',
        size: 240
    },
];

// TODO common methods for files inside blogs and users
const avatarResizingAndSaving = async (avatar) => {
    let newAvatarId;
    const imageUploading = [];
    const filename = `${avatar.fieldname}-${uuid.v1()}${path.extname(avatar.originalname)}`;

    avatarFileSize.forEach(sizeMode => {
        imageUploading.push(
            sharp(avatar.buffer)
                .resize(null, sizeMode.size)
                .toFile(`public/avatars/${sizeMode.name}.${filename}`)
        )
    });

    imageUploading.push(
        new Promise((resolve, reject) => {
            fs.writeFile(`public/avatars/${filename}`, avatar.buffer, () => {
                Image.create({filePath: 'avatars/', fileName: filename})
                    .then((res) => {
                        newAvatarId = res._id;
                        resolve();
                    });
            });
        })
    );
    await Promise.all(imageUploading);
    return newAvatarId;
};

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
    if (user) {
       response.send(user);
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
        request.body.avatar = await avatarResizingAndSaving(request.file);

        if (oldProfile.avatar) {
            const {fileName, filePath, _id} = oldProfile.avatar;

            if(fileName !== 'default.jpg') {
                fs.unlink(`public/${filePath + fileName}`, err => console.log(err));
                avatarFileSize.forEach(sizeMode => {
                    fs.unlink(`public/${filePath + sizeMode.name}.${fileName}`,
                        err => console.log(err));
                });
                Image.findOneAndDelete({_id: _id})
                    .catch(err => console.log(err));
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
