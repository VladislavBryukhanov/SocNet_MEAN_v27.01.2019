const router = require('express').Router();
const EventEmitter = require('events');
const Chat = require('../models/chat');

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

const sseHandler = (response, EVENT, checkAccess) => {
  response.status(200).set(sseHeaders);
  
  setInterval(
    () => response.write('event: ping\n\n'),
    30000
  );

  event.on(EVENT, async (payload) => {
    const isAccessGranted = await checkAccess(payload);
    if (isAccessGranted) {
      response.write(buildSseResponse(payload));
    }
  });
}

router.get('/incomingMessages', (request, response) => {
  const checkAccess = async ({ message, chatId }) => {
    const chat = await Chat.findOne({ _id: chatId });
    const isMeInChat = chat.users.some(user => user.equals(request.user._id));
    const isNotMyMessage = !message.user._id.equals(request.user._id);
    return isMeInChat && isNotMyMessage;
  };

  sseHandler(response, INCOMING_MESSAGE, checkAccess)
});

router.get('/chatCreated', (request, response) => {
  const checkAccess = (chat) => {
    return chat.users.some(
      user => user._id.equals(request.user._id)
    )
  };

  sseHandler(response, CHAT_CREATED, checkAccess)
});

module.exports = router;
module.exports.chatEvent = event;