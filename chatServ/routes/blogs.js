const express = require('express');
const router = express.Router();
const path = require('path');
const Rate = require('../models/rate');
const Blog = require('../models/blog');
const fs = require('fs');
const jimp = require('jimp');
const multer = require('multer');
// const storage = multer.diskStorage({
//     destination: function(req, file, cb) {
//         cb(null, path.join(__dirname+ '/../', 'public/blogs'))
//     },
//     filename: function(req, file, cb) {
//         cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
//     }
// });

// const getFileName = (file) => `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`;
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {fileSize: 5 * 1024 * 1024}
});

let blogFileSize = [
    {
        name: 'min',
        size: 350
    }
];

router.get('/getBlog/:userId&:count&:page', async(request, response) => {
    let maxCount = request.params.count;
    let currentPage = request.params.page;
    let blog = await Blog.find(
            {owner: request.params.userId},
            [],
            {skip: currentPage * maxCount, limit: maxCount}
        ).sort({date: -1});
    blog.length > 0 ? response.send(blog) : response.sendStatus(404);
});

router.get('/getPost/:postId', async(request, response) => {
    response.send(await Blog.findOne({_id: request.params.postId}));
});

router.post('/addPost', upload.array('files', 12), async(request, response) => {
    let post = {
        attachedFiles: [],
        textContent: request.body.content,
        owner: request.user._id
    };
    const imageReading = [];
    const imageUploading = [];
    if(request.files.length > 0) {
        request.files.forEach((file) => {
            const filename = `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`;
            imageReading.push(
                jimp.read(file.buffer)
                    .then(img => {
                        imageUploading.push(
                            img.writeAsync(`public/blogs/${filename}`)
                                .then(() => {
                                    post.attachedFiles.push(`blogs/${filename}`);
                                    console.log(post, 'hi')
                                })
                        );
                        blogFileSize.forEach(async sizeMode => {
                            img.resize(jimp.AUTO, sizeMode.size);
                            img.writeAsync(`public/blogs/${sizeMode.name}.${filename}`);
                        });
                    })
            );
        });
    }
    await Promise.all(imageReading);
    await Promise.all(imageUploading);
    if(!post.textContent && post.attachedFiles.length === 0) {
        return response.sendStatus(404);
    }

    response.send(await Blog.create(post));
});

router.put('/editPost', upload.array('files', 12), async(request, response) => {
    let post = {
        attachedFiles: request.body.existsFiles ? request.body.existsFiles : [],
        textContent: request.body.content,
        owner: request.user._id
    };

    let existsPost = await Blog.findOne({_id: request.body._id, owner: request.user._id});
    existsPost.attachedFiles.forEach(file => {
       if(!post.attachedFiles.includes(file)) {
           fs.unlink(`public/${file}`, err => console.log(err));
       }
    });

    request.files.forEach((file) => {
        post.attachedFiles.push(`blogs/${file.filename}`);
    });

    if(!post.textContent && post.attachedFiles.length === 0) {
        return response.sendStatus(404);
    }

    response.send(await Blog.findOneAndUpdate({
        _id: request.body._id, owner: request.user._id}, post, { "new": true }));
});

router.delete('/deletePost/:_id', async(request, response) => {
    let deletedItem = await Blog.findOneAndRemove({
        _id: request.params._id, owner: request.user._id
    });
    if(deletedItem) {
        deletedItem.attachedFiles.forEach(file => {
            fs.unlink(`public/${file}`, err => console.log(err));
            blogFileSize.forEach(async sizeMode => {
                fs.unlink(`public/${sizeMode.name}.${file}`, err => console.log(err));
            });
        });
        await Rate.findOneAndDelete({itemId: deletedItem._id});
    }
    response.send(deletedItem);
});

module.exports = router;
