const express = require('express')
const router = express.Router()
const _ = require('lodash')
const getSequelizeConnection = require('../modules/database-new/connection').getSequelizeConnection
const WordModel = require('../models/word').model
const Sequelize = require('../models/word').sequelize

const { getUserFromRequest } = require('../helpers')
const generateLetters = () => {
  const result = []
  _.range(9).map(() => result.push('a'))
  _.range(1).map(() => result.push('ą'))
  _.range(2).map(() => result.push('b'))
  _.range(3).map(() => result.push('c'))
  _.range(1).map(() => result.push('ć'))
  _.range(3).map(() => result.push('d'))
  _.range(7).map(() => result.push('e'))
  _.range(1).map(() => result.push('ę'))
  _.range(1).map(() => result.push('f'))
  _.range(2).map(() => result.push('g'))
  _.range(2).map(() => result.push('h'))
  _.range(8).map(() => result.push('i'))
  _.range(2).map(() => result.push('j'))
  _.range(3).map(() => result.push('k'))
  _.range(3).map(() => result.push('l'))
  _.range(2).map(() => result.push('ł'))
  _.range(3).map(() => result.push('m'))
  _.range(5).map(() => result.push('n'))
  _.range(1).map(() => result.push('ń'))
  _.range(6).map(() => result.push('o'))
  _.range(1).map(() => result.push('ó'))
  _.range(3).map(() => result.push('p'))
  _.range(4).map(() => result.push('r'))
  _.range(4).map(() => result.push('s'))
  _.range(1).map(() => result.push('ś'))
  _.range(3).map(() => result.push('t'))
  _.range(2).map(() => result.push('u'))
  _.range(4).map(() => result.push('w'))
  _.range(4).map(() => result.push('y'))
  _.range(5).map(() => result.push('z'))
  _.range(1).map(() => result.push('ź'))
  _.range(1).map(() => result.push('ż'))
  _.range(2).map(() => result.push('_'))

  return _.shuffle(result)
}
const validateNewLetters = (board, availableLetters) => {
  const newLetters = []
  board.forEach((y) => {
    y.forEach((obj) => {
      if (obj['isNew']) {
        newLetters.push(obj['letter'])
      }
    })
  })
  const count = (array) => {
    const result = {}
    array.forEach((letter) => {
      if (!result[letter]) {
        result[letter] = 0
      }
      result[letter]++
    })
    return result
  }

  const obj1 = count(newLetters)
  const obj2 = count(availableLetters)

  let valid = true
  availableLetters.forEach((letter) => {
    if (obj1[letter] > obj2[letter] || !obj2[letter]) {
      valid = false
    }
  })

  return valid
}
const findWordsInBoard = (board) => {
  const words = []

  const search = (board) => {
    // find horizontal
    for (let y = 0; y < board.length; y++) {
      let breakTo = false

      for (let x = 0; x < board[y].length; x++) {
        if (breakTo !== false) {
          if (x <= breakTo) {
            continue
          }
        }

        const letter = board[y][x]['letter']

        if (letter && board[y][x + 1] !== undefined && board[y][x + 1]['letter']) {
          let word = letter
          for (let _x = x + 1; _x < board[y].length; _x++) {
            const _letter = board[y][_x]['letter']
            if (_letter) {
              word += _letter
              if (_x === board[y].length - 1) { //save
                breakTo = _x
                words.push(word)
                break
              }
            } else { // save
              breakTo = _x
              words.push(word)
              break
            }
          }
        }
      }
    }
  }
  search(board)

  const transposed = _.cloneDeep(board)
  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[y].length; x++) {
      transposed[x][y] = { ...board[y][x] }
    }
  }
  search(transposed)

  return words
}
const hasLetterInCenter = (board) => {
  return !hasFieldEmptyLetter(board[7][7])
}
const hasFieldEmptyLetter = (field) => {
  return field['letter'] === null
}
const hasAloneLetter = (board) => {
  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[y].length; x++) {
      if (!hasFieldEmptyLetter(board[y][x])) {
        let fieldsNextTo = 0
        for (let _y = y - 1, __y = -1; _y <= y + 1; _y++, __y++) {
          for (let _x = x - 1, __x = -1; _x <= x + 1; _x++, __x++) {
            if (_y >= 0 && _y < board.length && _x >= 0 && _x < board[y].length) {
              if ((__x === -1 && __y === 0) || (__x === 1 && __y === 0) || (__y === -1 && __x === 0) || (__y === 1 && __x === 0)) {
                fieldsNextTo++
              }
            }
          }
        }
        let emptyFields = 0
        for (let _y = y - 1, __y = -1; _y <= y + 1; _y++, __y++) {
          for (let _x = x - 1, __x = -1; _x <= x + 1; _x++, __x++) {
            if (_y >= 0 && _y < board.length && _x >= 0 && _x < board[y].length) {
              if ((__x === -1 && __y === 0) || (__x === 1 && __y === 0) || (__y === -1 && __x === 0) || (__y === 1 && __x === 0)) {
                if (hasFieldEmptyLetter(board[_y][_x])) {
                  emptyFields++
                }
              }
            }
          }
        }
        if (emptyFields === fieldsNextTo) {
          return true
        }
      }
    }
  }
  return false
}
const getWordsCountFromDatabase = async (words) => {
  return new Promise((resolve) => {
    let query = 'SELECT count(*) as count from words WHERE '
    query += words.map((word) => {
      return `word COLLATE utf8_polish_ci LIKE '${word.replace(/[!@#$%^&*()'"{}\[\]<>?/.,]/g, '')}'`
    }).join(' OR ') + ' LIMIT 1';

    getSequelizeConnection().query(query).then((response) => {
      resolve(response[0][0].count)
    })
  })
}

router.get('/start', async (req, res) => {
  const myLetters = generateLetters()
  const botLetters = generateLetters()

  req.session.data = {
    myLetters: myLetters.slice(7),
    botLetters,
    move: 0,
    myLettersValidation: myLetters.slice(0, 7),
  }

  req.session.save()

  return res.json({
    status: 'OK',
    data: {
      myLetters: myLetters.slice(0, 7),
      move: 0,
    }
  })
})

router.post('/move', async (req, res) => {
  const { board } = req.body
  const { data } = req.session

  /*if (!validateNewLetters(board, data.myLettersValidation)) {
      res.status(422);
      return res.json({
          status: 'ERR',
          error: {
              message: 'Próba obejścia zabezpieczeń. Zostałeś zbanowany.',
          }
      });
  }*/

  if (data['move'] === 0) {
    if (!hasLetterInCenter(board)) {
      res.status(422)
      return res.json({
        status: 'ERR',
        error: {
          message: 'Pierwsze słowo musi przechodzić przez środek planszy.',
        }
      })
    }
  }

  if (hasAloneLetter(board)) {
    res.status(422)
    return res.json({
      status: 'ERR',
      error: {
        message: 'Litery muszą łączyć się.',
      }
    })
  }

  const words = findWordsInBoard(board)
  const existingsWordsNum = await getWordsCountFromDatabase(words)
  if (words.length !== existingsWordsNum) {
    res.status(422)
    return res.json({
      status: 'ERR',
      error: {
        message: 'Jedno ze słów jest nieprawidłowe.',
      }
    })
  }

  console.log(words, existingsWordsNum)
})

exports.router = router
