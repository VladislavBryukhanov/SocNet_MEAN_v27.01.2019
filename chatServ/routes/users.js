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
    request.body.avatar = `avatars/${request.file.filename}`;
    let newProfile = await User.findOneAndUpdate({_id: request.user._id}, request.body, {new: true});
    if(newProfile) {
        response.send(newProfile);
    } else {
        response.sendStatus(404);
    }
});

module.exports = router;