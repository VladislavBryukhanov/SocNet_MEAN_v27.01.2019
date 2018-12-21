const express = require('express');
const router = express.Router();
const path = require('path');
const Rate = require('../models/rate');
const Blog = require('../models/blog');
const Image = require('../models/image');
const Comment = require('../models/comment');
const mongoose = require('mongoose');
const _ = require('lodash');
const fs = require('fs');
const uuid = require('uuid');
const sharp = require('sharp');
const findWithPaging = require('../common/paging');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {fileSize: 5 * 1024 * 1024}
});

const blogFileSize = [
    {
        name: 'normal',
        size: 500
    },
    {
        name: 'min',
        size: 120
    }
];

const fileResizingAndSaving = async (files) => {
    const attachedFiles = [];
    const imageUploading = [];

    if(files.length > 0) {
        files.forEach((file) => {
            const filename = `${file.fieldname}-${uuid.v1()}${path.extname(file.originalname)}`;

            blogFileSize.forEach(sizeMode => {
                imageUploading.push(
                    sharp(file.buffer)
                        .resize(null, sizeMode.size)
                        .toFile(`public/blogs/${sizeMode.name}.${filename}`)
                )
            });

            imageUploading.push(
                new Promise((resolve, reject) => {
                    fs.writeFile(`public/blogs/${filename}`, file.buffer, () => {
                        Image.create({filePath: 'blogs/', fileName: filename})
                            .then((res) => {
                                attachedFiles.push(res._id);
                                resolve();
                            });
                    });
                })
            );
        });
    } else {
        return [];
    }
    await Promise.all(imageUploading);
    return attachedFiles;
};

const getRateAndComments = async (items, user) => {
    // todo import from rate
    const actions = {
        LIKE: 'like',
        DISLIKE: 'dislike'
    };
    const queries = [];
    const updatedBlogPayload = [];

    items.forEach(item => {
        const itemId = item._id;
        let commentsCounter = Comment.count({itemId});
        let isCommentedByMe = !!Comment.findOne({itemId, user});

        let likeCounter = Rate.count({itemId, isPositive: true});
        let dislikeCounter = Rate.count({itemId, isPositive: false});
        let myAction = Rate.findOne({itemId, user})
            .then(myAction => {
                return !myAction ? null
                    : myAction.isPositive ? actions.LIKE : actions.DISLIKE;
            });

        queries.push(
            Promise.all([
                commentsCounter,
                isCommentedByMe,
                likeCounter,
                dislikeCounter,
                myAction
            ]).then(res => {
                const [
                    commentsCounter,
                    isCommentedByMe,
                    likeCounter,
                    dislikeCounter,
                    myAction
                ] = res;

                const comments = {
                    count: commentsCounter,
                    isCommentedByMe
                };

                const rate = {
                    likeCounter,
                    dislikeCounter,
                    myAction
                };

                updatedBlogPayload.push({
                    ...item.toObject(),
                    comments,
                    rate
                });
            }));
    });

    await Promise.all(queries);

    return updatedBlogPayload;
};


//TODO paging func
router.get('/getBlog/:id&:limit&:offset', async (request, response) => {
    // const id = request.params.id;
    const id = mongoose.Types.ObjectId(request.params.id);

    let res = await findWithPaging(request.params, Blog, {owner: id}, 'attachedFiles');
  /*  const result = await Blog.aggregate([
        { $match: {
                owner: id
            }},
        { $unwind: "$rate" },
        { $project: {
            user: "$owner",
            balance: { $sum: "$rate" }
        }}
    ]);*/
    Rate.aggregate([
        { $match: {
                user: id
            }},
        { $count: "count"}
    ], function (err, result) {
        if (err) {
            console.log(err);
            return;
        }
        console.log(result, '++++++++++++++++++++++++++++++++');
    });

    // console.log(result, '++++++++++++++++++++++++++++++++');
    // res.data = await getRateAndComments(res.data, request.user._id);
    res.data.length > 0 ? response.send(res) : response.sendStatus(404);
});

router.get('/getPost/:postId', async(request, response) => {
    // TODO getRateAndComments
    response.send(await Blog.findOne({_id: request.params.postId})
        .populate('attachedFiles'));
});

router.post('/addPost', upload.array('files', 12), async (request, response) => {
    const post = {
        textContent: request.body.content,
        owner: request.user._id
    };

    post.attachedFiles = await fileResizingAndSaving(request.files);

    if(!post.textContent && post.attachedFiles.length === 0) {
        return response.sendStatus(404);
    }

    let blog = await Blog.create(post);
    blog = await Blog.populate(blog, 'attachedFiles');
    response.send(blog);
});

router.put('/editPost', upload.array('files', 12), async (request, response) => {
    const post = {
        attachedFiles: request.body.existsFiles ? request.body.existsFiles : [],
        textContent: request.body.content,
        owner: request.user._id
    };

    const existsPost = await Blog.findOne({_id: request.body._id, owner: request.user._id})
        .populate('attachedFiles');

    existsPost.attachedFiles.forEach(file => {
        // typeof file._id = string, typeof post.id = ObjectId
        if(!post.attachedFiles.some(file_id => file_id == file._id)) {
            fs.unlink(`public/${file.filePath + file.fileName}`, err => console.log(err));
            blogFileSize.forEach(sizeMode => {
                fs.unlink(`public/${file.filePath + sizeMode.name}.${file.fileName}`, err => console.log(err));
            });
            existsPost.attachedFiles = existsPost.attachedFiles.filter(item => item._id != file._id);
            Image.findOneAndDelete({_id: file._id})
                .catch(err => console.log(err));
        }
    });

    post.attachedFiles = [
        ...existsPost.attachedFiles,
        ...await fileResizingAndSaving(request.files)
    ];

    if(!post.textContent && post.attachedFiles.length === 0) {
        return response.sendStatus(404);
    }

    const blog = await Blog.findOneAndUpdate({
        _id: request.body._id, owner: request.user._id},
        post,
        { "new": true }
    ).populate('attachedFiles');
    response.send(blog);
});

router.delete('/deletePost/:_id', async (request, response) => {
    const deletedItem = await Blog.findOneAndRemove({
        _id: request.params._id, owner: request.user._id
    }).populate('attachedFiles');
    if(deletedItem) {
        deletedItem.attachedFiles.forEach(file => {
            const {fileName, filePath} = file;
            fs.unlink(`public/${filePath + fileName}`, err => console.log(err));
            blogFileSize.forEach(sizeMode => {
                fs.unlink(`public/${filePath + sizeMode.name}.${fileName}`,
                        err => console.log(err));
            });
            Image.findOneAndDelete({_id: file._id})
                .catch(err => console.log(err));
        });
        Rate.findOneAndDelete({itemId: deletedItem._id})
            .catch(err => console.log(err));
    }
    response.send(deletedItem);
});

module.exports = router;
