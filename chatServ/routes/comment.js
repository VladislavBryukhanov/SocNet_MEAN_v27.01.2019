const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
const path = require('path');
const mongoose = require('mongoose');
const fs = require('fs');

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, '/../public/comments'))
    },
    filename: function(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
    }
});
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

//TDOO blogs and comments equals

router.get('/getCommentsCounter/:itemId&:userId', async (request, response) => {
    let itemId = request.params.itemId;
    let user = mongoose.Types.ObjectId(request.params.userId);

    let commentsCounter = await Comment.count({itemId});
    let isCommentedByMe = !!await Comment.findOne({itemId, user});

    response.send({commentsCounter, isCommentedByMe});
});

router.get('/getComment/:commentId', async(request, response) => {
    response.send(await Comment.findOne({_id: request.params.commentId}));
});

router.get('/getComments/:itemId&:count&:page', async(request, response) => {
    let maxCount = request.params.count;
    let currentPage = request.params.page;
    let comments = await Comment.find({itemId: request.params.itemId})
        .skip(currentPage * maxCount)
        .limit(maxCount)
        .populate('user');
    if(comments.length > 0) {
        response.send(comments);
    } else {
        response.sendStatus(404);
    }
});

router.post('/addComment', upload.array('files', 12), async (request, response) => {
    let comment = {
        user: mongoose.Types.ObjectId(request.user._id),
        attachedFiles: [],
        itemId: request.body.itemId,
        textContent: request.body.content
    };
    request.files.forEach(file => {
        comment.attachedFiles.push(`comments/${file.filename}`);
    });
    if(comment.textContent.length > 0 || comment.attachedFiles.length > 0) {

        //TODO populate user ? mb need add if (userId = myAuth.id) useMy session ?
        let newComment = await Comment.create(comment);
        await Comment.populate(newComment, 'user');
        response.send(newComment);
    } else {
        response.sendStatus(404);
    }
});

router.put('/editComment', upload.array('files', 12), async(request, response) => {
    let post = {
        attachedFiles: request.body.existsFiles ? request.body.existsFiles : [],
        textContent: request.body.content,
        user: mongoose.Types.ObjectId(request.user._id),
    };

    let existsPost = await Blog.findOne({_id: request.body._id, owner: request.user._id});
    existsPost.attachedFiles.forEach(file => {
        if(!post.attachedFiles.includes(file)) {
            fs.unlink(`public/${file}`, err => console.log(err));
        }
    });

    if(request.files.length > 0) {
        request.files.forEach((file) => {
            post.attachedFiles.push(`blogs/${file.filename}`);
        });
    }

    if(!post.textContent && post.attachedFiles.length === 0) {
        return response.sendStatus(404);
    }

    response.send(await Blog.findOneAndUpdate({
        _id: request.body._id, owner: request.user._id}, post, { "new": true }));
});

router.delete('/deleteComment/:_id', async(request, response) => {
    let deletedItem = await Comment.findOneAndRemove({
        _id: request.params._id, owner: request.user._id
    });
    if(deletedItem) {
        deletedItem.attachedFiles.forEach(file => {
            fs.unlink(`public/${file}`, err => console.log(err));
        });
        await Comment.findOneAndDelete({itemId: deletedItem._id});
    }
    response.send(deletedItem);
});


module.exports = router;
