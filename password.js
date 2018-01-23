var crypto = require('crypto');
var password = '21232f297e4a801fc3';

console.log(crypto.createHash('md5').update(password).digest('hex'));