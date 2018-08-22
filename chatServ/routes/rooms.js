var express = require('express');
var router = express.Router();
var Room = require('../models/room');

router.get("/getRooms", (request, response) => {
    Room.find({}, (err, data) => {
        response.send(data);
    });
});

router.post("/addRoom", (request, response) => {

});

module.exports = router;