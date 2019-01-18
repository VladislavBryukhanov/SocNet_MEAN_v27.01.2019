const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const objId = mongoose.Types.ObjectId;
const _ = require('lodash');

const Rate = require('../models/rate');
const Blog = require('../models/blog');
const Comment = require('../models/comment');
const actions = require('../common/constants').actions;
const blogFileSize = require('../common/imageFiles/imagesSize').blogFileSize;
const maxFileSize = require('../common/imageFiles/imagesSize').maxFileSize;
const findWithPaging = require('../common/paging');
const resizeAndSaveImage = require('../common/imageFiles/imageActions').resizeAndSaveImage;
const deleteAttachedFiles = require('../common/imageFiles/imageActions').deleteAttachedFiles;
const getRateInfo = require('./rate').getRateInfo;

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: maxFileSize
});

const appendRateAndComments = async (user, items) => {
    // TODO find of 8 blogs and this to one query - model.find + aggregate or full query = aggregate
    const idOfposts = items.map(item => objId(item.id));

    let rate = await getRateInfo(
        Blog,
        {_id: {$in: idOfposts}},
        user
    );

    //TODO comment and rate to one aggregation ____ NO
    //TODO comment aggregation to comments router

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

    post.attachedFiles = await resizeAndSaveImage(request.files, 'blogs/', blogFileSize);

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
            deleteAttachedFiles(file, blogFileSize);
            existsPost.attachedFiles = existsPost.attachedFiles.filter(
                item => item._id != file._id);
        }
    });

    post.attachedFiles = [
        ...existsPost.attachedFiles,
        ...await resizeAndSaveImage(request.files, 'blogs/', blogFileSize)
    ];

    if(!post.textContent && post.attachedFiles.length === 0) {
        return response.sendStatus(404);
    }

    let blog = await Blog.findOneAndUpdate(
        {_id: request.body._id, owner: request.user._id},
        post,
        { "new": true }
    ).populate('attachedFiles');
    [blog] = await appendRateAndComments(objId(request.user._id), [blog]);

    response.send(blog);
});

router.delete('/deletePost/:_id', async (request, response) => {
    //TODO mb replace to pre (cascade style)
    const deletedItem = await Blog.findOneAndRemove({
        _id: request.params._id, owner: request.user._id
    }).populate('attachedFiles');
    if(deletedItem) {
        deleteAttachedFiles(deletedItem.attachedFiles, blogFileSize);
        Rate.deleteMany({_id: {$in: deletedItem.rate}})
            .catch(err => console.log(err));
        Comment.deleteMany({_id: {$in: deletedItem.comments}})
            .catch(err => console.log(err));
    }
    response.send(deletedItem);
});

module.exports = router;