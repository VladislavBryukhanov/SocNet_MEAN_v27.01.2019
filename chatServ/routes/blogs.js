const express = require('express');
const router = express.Router();
const path = require('path');
const Blog = require('../models/blog');

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname+ '/../', 'public/blogs'))
    },
    filename: function(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()} ${path.extname(file.originalname)}`)
    }
});
const upload = multer({
    storage: storage,
    limits: {fileSize: 5 * 1024 * 1024}
});

router.get('/getBlogs/:userId', async(request, response) => {
    let blogs = await Blog.find({owner: request.params.userId});
    if (blogs) {
        response.send(blogs);
    } else {
        response.sendStatus(404);
    }
});

router.post('/postBlog', upload.array('files', 12), async(request, response) => {
    let post = {
        attachedFiles: [],
        textContent: request.body.content,
        owner: request.user._id
    };
    if(request.files.length > 0) {
        request.files.forEach((file) => {
            post.attachedFiles.push(`blogs/${file.filename}`);
        });
    }
    // else {
    //     delete request.body.picture;
    // }
    let newBlogPost = await Blog.create(post);
    if(newBlogPost) {
        response.send(newBlogPost);
    } else {
        response.sendStatus(404);
    }

});

router.delete('/removeBlog', async(request, response) => {

});

module.exports = router;