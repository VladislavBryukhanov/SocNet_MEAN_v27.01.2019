const express = require('express');
const router = express.Router();
const path = require('path');

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

router.get('/getBlogs', async(request, response) => {

});

router.post('/postBlog', upload.single('picture'), async(request, response) => {
    console.log(request.file);
    console.log(request.body.files);
});

router.delete('/removeBlog', async(request, response) => {

});

module.exports = router;