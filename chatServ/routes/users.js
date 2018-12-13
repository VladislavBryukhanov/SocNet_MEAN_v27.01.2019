const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Image = require('../models/image');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const authPayload = require('../modules/tokenPayload');
// const jimp = require('jimp');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname + '/../', 'public/avatars'))
    },
    filename: function(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
    }
});
const upload = multer({
    storage: storage,
    limits: {fileSize: 5 * 1024 * 1024}
});

/*let avatarFileSize = [
    {
        name: 'min',
        size: 50
    },
    {
        name: 'normal',
        size: 240
    },
];*/

router.put('/editProfile', upload.single('avatar'), async (request, response) => {
    const oldProfile = await User.findOne({_id: request.user._id});
    if(request.file) {
        const avatar = {
            filePath: 'avatars/',
            fileName: request.file.filename
        };
        request.body.avatar = await Image.create(avatar).then(avatar => avatar._id);
        // TODO default avatar
        if (oldProfile.avatar) {
            const {fileName, filePath} = oldProfile.avatar;
            if(fileName !== 'default.jpg') {
                fs.unlink(`public/${filePath + fileName}`, err => console.log(err));
            }
        }
      /*  console.log(file);
        jimp.read(request.body.avatar.body)
            .then(img => {
                avatarFileSize.forEach(sizeMode => {
                    img.resize(jimp.AUTO, sizeMode.size);
                    img.write(`public/blogs/${sizeMode.name}.${file.filename}`);
                });
            });*/
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
