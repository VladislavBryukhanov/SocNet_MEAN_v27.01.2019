var express = require('express');
var router = express.Router();
var Room = require('../models/room');

router.get("/getRooms", (request, response) => {
    Room.find({}, (err, data) => {
        response.send(data);
    });
});

router.post("/addRoom", (request, response) => {
    let newRoom = new Room(request.body);
    newRoom.save((err, res) => {
        response.send(res);
    });
});

module.exports = router;