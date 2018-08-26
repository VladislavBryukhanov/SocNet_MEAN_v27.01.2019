var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');


var romsRouter = require('./routes/rooms');
var authRouter = require('./routes/auth');

var app = express();
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/chat', { useNewUrlParser: true });

app.use(cors({
    origins: 'localhost:3000'
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', authRouter);
app.use('/rooms', romsRouter);

module.exports = app;
