const router = require('express').Router();
const EventEmitter = require('events');
const event = new EventEmitter();
const { CHAT_CREATED, INCOMING_MESSAGE } = require('../common/constants').sseEvents;

const sseHeaders = {
  "connection": 'keep-alive',
  "cache-control": 'no-cache',
  "content-Type": "text/event-stream"
};

// w3c sse response format
const buildSseResponse = (payload) => 
  `data: ${JSON.stringify(payload)}\n\n`;

const sseHandler = (response, EVENT) => {
  response.status(200).set(sseHeaders);
  event.on(EVENT, (message) => {
    response.write(
      buildSseResponse(message)
    );
  });
}

router.get('/incomingMessages', (requset, response) =>
  sseHandler(response, INCOMING_MESSAGE)
);

router.get('/chatCreated', (requset, response) =>
  sseHandler(response, CHAT_CREATED)
);

module.exports = router;
module.exports.chatEvent = event;