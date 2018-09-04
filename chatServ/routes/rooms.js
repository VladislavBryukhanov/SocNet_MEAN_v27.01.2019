const express = require('express');
const router = express.Router();
const Room = require('../models/room');

router.get("/getRooms", (request, response) => {
    Room.find({}, (err, data) => {
        response.send(data);
    });
});

router.post("/addRoom", (request, response) => {
    console.log(request.user);
    let newRoom = new Room(request.body);
    newRoom.save((err, res) => {
        response.send(res);
    });
});

module.exports = router;