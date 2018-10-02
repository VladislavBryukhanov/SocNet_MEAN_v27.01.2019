const secret = require('../secret');
const jwt = require('jsonwebtoken');

const authPayload = (user) => {
    let payload = {
        "role": user.role,
        "_id": user._id,
        "session_hash": user.session_hash
    };
    let token = jwt.sign(payload, secret, {expiresIn: 365 * 24 * 60 * 60});

    user = user.toObject();
    delete user.session_hash;

    let res = {
        token: token,
        user: user
    };
    return res;
};

module.exports = authPayload;
