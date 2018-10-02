const User = require('../models/user');

const authTokenAccess = (unless) => {
    return async (request, response, next) => {
        if(unless.includes(request.path)) {
            next();
        }

        if (await User.findOne({
                _id: request.user._id,
                role: request.user.role,
                session_hash: request.user.session_hash
            })) {
            next();
        } else {
            response.sendStatus(401);
        }
    }
};

module.exports = authTokenAccess;
