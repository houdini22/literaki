const Sequelize = require('sequelize')
const sequelize = require('../modules/database-new/connection').getSequelizeConnection()

const Word = sequelize.define('words', {
  word: Sequelize.STRING,
}, {
  timestamps: false,
})

exports.model = Word
exports.sequelize = sequelize
