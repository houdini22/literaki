const fs = require('fs');

const content = fs.readFileSync('./slowa.txt', 'UTF-8').replace(/\s+/g, '\n').replace(/\n+/g, '\n');
fs.writeFileSync('./slowa2.txt', content);
