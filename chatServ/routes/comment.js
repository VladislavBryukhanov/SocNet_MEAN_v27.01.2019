const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
const mongoose = require('mongoose');
const fs = require('fs');
const { COMMENT_ADDED } = require('../common/constants').commentEventActions;
const { commentEvent } = require('../sockets/comments');
const { maxFileSize } = require('../common/imageFiles/imagesSize');
const { commentFileSize } = require('../common/imageFiles/imagesSize');
const { resizeAndSaveImage } = require('../common/imageFiles/imageActions');
const bindDbModelMiddleware = require('../middlewares/bindDbModel');
const objId = mongoose.Types.ObjectId;
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: maxFileSize
});

//TDOO blogs and comments equals

// router.get('/getCommentsCounter/:itemId&:targetModel&:userId', bindDbModelMiddleware, async (request, response) => {
//     const itemId = request.params.itemId;
//     const user = objId(request.params.userId);

//     // FIXME replace to aggregate
//     const Model = request.targetModel;
//     Model.aggregate([
//         {
//             $match: { _id: itemId}
//         },
//     ])
//     const count = await request.targetModel.aggregate([
//         {
//             $match: { _id: objId(request.params.itemId) }
//         },
//         {
//             $lookup: {
//                 from: "comments",
//                 localField: "comments",
//                 foreignField: "_id",
//                 as: "comments"
//             },
//         },
//         {
//             $project: {
//                 count: {
//                     $size: $comments
//                 }
//             }
//         }
     
//     ]).then(res => res[0].count);

//     const commentsCounter = await Comment.count({itemId});
//     const isCommentedByMe = !!await Comment.findOne({itemId, user});

//     response.send({commentsCounter, isCommentedByMe});
// });

router.get('/getComment/:commentId', async (request, response) => {
    response.send(await Comment.findOne({_id: request.params.commentId}));
});

router.get('/getComments/:itemId&:targetModel&:limit&:offset', bindDbModelMiddleware, async (request, response) => {
    const { offset, limit } = request.params;

    const [ result ] = await request.targetModel.aggregate([
        {
            $match: { _id: objId(request.params.itemId) }
        },
        {
            $lookup: {
                from: "comments",
                localField: "comments",
                foreignField: "_id",
                as: "comments"
            }
        },
        {
            $project: {
                comments: "$comments",
                count: { $size: "$comments" }
            }
        },
        { $unwind: "$comments" },
        { $sort: { "comments.date": 1 } },
        { $skip: +offset },
        { $limit: +limit },
        {
            $lookup: {
                from: "images",
                localField: 'comments.attachedFiles',
                foreignField: '_id',
                as: "comments.attachedFiles"
            }
        },
        {
            $lookup: {
                from: "users",
                localField: 'comments.user',
                foreignField: '_id',
                as: "comments.user"
            }
        },
        { $unwind: "$comments.user" },
        {
            $lookup: {
                from: "images",
                localField: 'comments.user.avatar',
                foreignField: '_id',
                as: "comments.user.avatar"
            }
        },
        {$unwind: "$comments.user.avatar"},
        {
            $group: {
                _id: "$_id",
                data: { $push: "$comments" },
                count: { $first: "$count" },
            }
        }
    ]);

    result.data.forEach(comment => {
        delete comment.user.password,
        delete comment.user.session_hash
    });

    response.send({ ...result, offset });
});

router.post('/addComment', upload.array('files', 12), bindDbModelMiddleware, async (request, response) => {
    const { itemId, content } = request.body;
    const comment = {
        user: objId(request.user._id),
        attachedFiles: [],
        itemId,
        textContent: content
    };

    comment.attachedFiles = await resizeAndSaveImage(request.files, 'comments/', commentFileSize);

    if(comment.textContent || comment.attachedFiles.length > 0) {
        const newComment = await Comment.create(comment);
        await Comment.populate(newComment, {
            path: 'user',
            populate: {path: 'avatar'}
        });
        await request.targetModel.updateOne(
            {_id: objId(itemId)},
            { $push: {comments: newComment._id} }
        );

        commentEvent.emit(COMMENT_ADDED, newComment);
        response.send(newComment);
    } else {
        response.sendStatus(400);
    }
});

router.put('/editComment', upload.array('files', 12), async (request, response) => {
    const post = {
        attachedFiles: request.body.existsFiles || [],
        textContent: request.body.content,
        user: mongoose.Types.ObjectId(request.user._id),
    };

    const existsPost = await Blog.findOne({_id: request.body._id, owner: request.user._id});
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

    const comment = await Blog.findOneAndUpdate(
        {
            _id: request.body._id,
             owner: request.user._id
        },
        post,
        { "new": true }
    );

    response.send(comment);
});

router.delete('/deleteComment/:_id', async (request, response) => {
    const deletedItem = await Comment.findOneAndRemove({
        _id: request.params._id,
        owner: request.user._id
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
