const fs = require('fs');
module.exports = fs.readFileSync('./secret.pem', 'utf8');
