const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/chat', { useNewUrlParser: true });

const exjwt = require('express-jwt');
const secret = require('./secret');

const jwtMW = exjwt({secret: secret})
    .unless({path: [
        '/signIn',
        '/signUp'
    ]});

const multer = require('multer');
const storage = multer.diskStorage({
   destination: function(req, file, cb) {
       cb(null, '/avatars')
   },
    filename: function(req, file, cb) {
       cb(null, `${file.filename} - ${Date.now()}`)
    }
});
const upload = multer({
    storage: storage,
    limits: {fileSize: 5 * 1024 * 1024}
});

const romsRouter = require('./routes/rooms');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');


// app.use(jwtMW);
app.use(cors({origins: 'localhost:3000'}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(jwtMW);
app.use('/', authRouter);
app.use('/rooms', romsRouter);
app.use('/users', usersRouter);


module.exports = app;
