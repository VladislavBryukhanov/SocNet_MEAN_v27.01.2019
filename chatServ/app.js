const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/chat', { useNewUrlParser: true });

const authTokenAccess = require('./middlewares/authTokenAccess');
const exjwt = require('express-jwt');
const secret = require('./secret');

const unless = [
    '/signIn',
    '/signUp'
];

const jwtMW = exjwt({secret: secret})
    .unless({path: unless});
const authAccess = authTokenAccess(unless);

const romsRouter = require('./routes/rooms');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const blogsRouter = require('./routes/blogs');
const rateRouter = require('./routes/rate');
const commentRouter = require('./routes/comment');

// app.use(jwtMW);
app.use(cors({origins: 'localhost:3000'}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use(jwtMW);
app.use(authAccess);
app.use('/', authRouter);
app.use('/rooms', romsRouter);
app.use('/users', usersRouter);
app.use('/blogs', blogsRouter);
app.use('/rate', rateRouter);
app.use('/comments', commentRouter);

module.exports = app;
