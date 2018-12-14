const express = require('express');
const router = express.Router();
const path = require('path');
const Rate = require('../models/rate');
const Blog = require('../models/blog');
const Image = require('../models/image');
const _ = require('lodash');
const fs = require('fs');
const uuid = require('uuid');
const sharp = require('sharp');
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

//TODO paging func
router.get('/getBlog/:userId&:count&:page', async(request, response) => {
    const maxCount = Number(request.params.count);
    const currentPage = Number(request.params.page);
    const blog = await Blog.find(
            {owner: request.params.userId},
            [],
            {skip: currentPage * maxCount, limit: maxCount}
        ).sort({date: -1}).populate('attachedFiles');
    blog.length > 0 ? response.send(blog) : response.sendStatus(404);
});

router.get('/getPost/:postId', async(request, response) => {
    response.send(await Blog.findOne({_id: request.params.postId})
        .populate('attachedFiles'));
});

router.post('/addPost', upload.array('files', 12), async(request, response) => {
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

router.put('/editPost', upload.array('files', 12), async(request, response) => {
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

router.delete('/deletePost/:_id', async(request, response) => {
    const deletedItem = await Blog.findOneAndRemove({
        _id: request.params._id, owner: request.user._id
    }).populate('attachedFiles');
    if(deletedItem) {
        deletedItem.attachedFiles.forEach(file => {
            fs.unlink(`public/${file.filePath + file.fileName}`, err => console.log(err));
            blogFileSize.forEach(sizeMode => {
                fs.unlink(`public/${file.filePath + sizeMode.name}.${file.fileName}`, err => console.log(err));
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
