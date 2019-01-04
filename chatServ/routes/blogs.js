const express = require('express');
const router = express.Router();
const path = require('path');
const Rate = require('../models/rate');
const Blog = require('../models/blog');
const Image = require('../models/image');
// const Comment = require('../models/comment');
const mongoose = require('mongoose');
const objId = mongoose.Types.ObjectId;
const _ = require('lodash');
const fs = require('fs');
const uuid = require('uuid');
const sharp = require('sharp');
const findWithPaging = require('../common/paging');
const multer = require('multer');

const actions = require('../common/constants').actions;

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
                        .toFile(`public/blogs/${sizeMode.name}/${filename}`)
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

const appendRateAndComments = async (user, items) => {
    // TODO find of 8 blogs and this to one query - model.find + aggregate or full query = aggregate
    const idOfposts = items.map(item => objId(item.id));
    let rate = await Blog.aggregate([
        {
            $match: {
                _id: {
                    $in: idOfposts
                }
            }
        },
        {
            $lookup: {
                from: "rates",
                localField: 'rate',
                foreignField: '_id',
                as: "rate"
            }
        },
        {
            "$project": {
                "_id": "$_id",
                "likeCounter": {
                    "$size": {
                        "$filter": {
                            "input": "$rate",
                            "cond": { "$eq": [ "$$this.isPositive", true ] }
                        }
                    }
                },
                "dislikeCounter": {
                    "$size": {
                        "$filter": {
                            "input": "$rate",
                            "cond": { "$eq": [ "$$this.isPositive", false ] }
                        }
                    }
                },
                "myAction": {
                    "$filter": {
                        "input": "$rate",
                        "cond": { "$eq": [ "$$this.user", user ] }
                    }
                }
            }
        }
    ]);

    //TODO comment and rate to one aggregation

    let comments = await Blog.aggregate([
        {
            $match: {
                _id: {
                    $in: idOfposts
                }
            }
        },
        {
            $lookup: {
                from: "comments",
                localField: 'comments',
                foreignField: '_id',
                as: "comments"
            }
        },
        {
            "$project": {
                "_id": "$_id",
                "count": {
                    "$size": "$comments"
                },
                "isCommentedByMe": {
                    "$filter": {
                        "input": "$comments",
                        "cond": { "$eq": [ "$$this.user", user ] }
                    }
                }
            }
        }
    ]);

    return items.map(post => {
        const rateInfo = rate.find(rate => rate._id.equals(post._id));
        rateInfo.myAction = _.isEmpty(rateInfo.myAction) ? null
            : rateInfo.myAction[0].isPositive ? actions.like : actions.dislike;

        const commentsInfo = comments.find(comment => comment._id.equals(post._id));
        commentsInfo.isCommentedByMe = !_.isEmpty(commentsInfo.isCommentedByMe);
        post.comments = commentsInfo;

        return {...post.toObject(), rate: rateInfo, comments: commentsInfo};
    });
};

router.get('/getBlog/:id&:limit&:offset', async (request, response) => {
    const id = objId(request.params.id);
    const user = objId(request.user._id);

    let res = await findWithPaging(request.params, Blog, {owner: id}, 'attachedFiles');
    if (_.isEmpty(res)) {
        return response.sendStatus(404)
    }

    // aggregate lookup will populate all child rate is it normal? and will remove them and return actual data
    // multiple count request vs $match
    res.data = await appendRateAndComments(user, res.data);
    return response.send(res);
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

    // TODO mb to one query ?
    let blog = await Blog.create(post);
    [blog] = await appendRateAndComments(objId(request.user._id), [blog]);
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