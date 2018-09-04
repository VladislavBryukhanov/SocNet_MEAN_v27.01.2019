const fs = require("fs");
const secret = fs.readFileSync('./secret.pem');
module.exports = secret;