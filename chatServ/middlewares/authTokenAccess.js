const User = require('../models/user');

const authTokenAccess = async (request, response, next) => {

    if(await User.findOne({
            _id: request.user._id,
            role: request.user.role,
            session_hash: request.user.session_hash
        })) {
        next();
    } else {
        response.sendStatus(401);
    }
};

module.exports = authTokenAccess;
