module.exports.actions = {
    like: 'like',
    dislike: 'dislike'
};

module.exports.ModelType = {
    Blog: 'Blog',
    Comment: 'Comment',
    Image: 'Image',
};

module.exports.commentEventActions = {
    COMMENT_ADDED: 'commentAdded',
    COMMENT_CHANGED: 'commentChanged',
    COMMENT_REMOVED: 'commentRemoved'
};

module.exports.sseEvents = {
    CHAT_CREATED: 'chatCreated',
    INCOMING_MESSAGE: 'incomingMessage'
};