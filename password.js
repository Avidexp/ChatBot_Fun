var crypto = require('crypto');
var password = 'Smile0759';

console.log(crypto.createHash('md5').update(password).digest('hex'));