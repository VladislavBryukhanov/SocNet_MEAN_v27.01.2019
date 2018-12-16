const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Image = require('../models/image');
const path = require('path');
const fs = require('fs');
const uuid = require('uuid');
const crypto = require('crypto');
const authPayload = require('../modules/tokenPayload');
const multer = require('multer');
const sharp = require('sharp');
/*const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname + '/../', 'public/avatars'))
    },
    filename: function(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
    }
});*/
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {fileSize: 5 * 1024 * 1024}
});

let avatarFileSize = [
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
        const session_hash_data = await User.findOne(request.body).select('session_hash');
        newProfile.session_hash = session_hash_data.session_hash;
        response.send(authPayload(newProfile));
    } else {
        response.sendStatus(404);
    }
});

router.get('/getUsers/:count&:page', async(request, response) => {
    const maxCount = Number(request.params.count);
    const currentPage = Number(request.params.page);
    const users = await User.find({}, [], {skip: currentPage * maxCount, limit: maxCount})
        .populate('avatar');
    users.length > 0 ? response.send(users) : response.sendStatus(404);
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
