var fs = require('fs');

var conf = JSON.parse(fs.readFileSync('conf.json'));

console.log(conf);
