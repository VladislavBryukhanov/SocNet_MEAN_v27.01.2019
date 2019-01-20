const ModelType = require('../common/constants').ModelType;
const mongoose = require('mongoose');

const bindDbModel = (request, response, next) => {
    const modelTarget = request.params.targetModel || request.body.targetModel;
    if (!ModelType.hasOwnProperty(modelTarget)) {
        return response.sendStatus(400);
    }
    request.targetModel = mongoose.model(modelTarget);
    next();
};

module.exports = bindDbModel;

