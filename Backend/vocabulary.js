const fs = require('fs');
const WordModel = require('./models/word').model;

const content = fs.readFileSync('./slowa.txt', 'UTF-8').split(/\n/);
const save = (index) => {
    WordModel.create({word: content[index].trim()}).then(() => {
        console.log(index);
        save(index + 1);
    });
};
save(1036153);