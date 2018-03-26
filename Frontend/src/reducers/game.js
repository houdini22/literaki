import http from '../modules/http'

// ------------------------------------
// Constants
// ------------------------------------
export const RESET = 'game::reset'
export const ADD_NEW_LETTER_TO_BOARD = 'game::add-new-letter-to-board'
export const MOVE_LETTER = 'game::move-letter'
export const START_GAME = 'game::start-game'
export const SET_ERROR = 'game::set-error'
// ------------------------------------
// Actions
// ------------------------------------
export const reset = () => (dispatch) => {
  dispatch({ type: RESET })
}

export const addNewLetterToBoard = (x, y, letter, index) => (dispatch) => {
  dispatch({
    type: ADD_NEW_LETTER_TO_BOARD,
    payload: {
      x, y, letter, index,
    }
  })
  dispatch(setError({}))
}

export const moveLetter = (oldX, oldY, newX, newY, letter) => (dispatch) => {
  dispatch({
    type: MOVE_LETTER,
    payload: {
      oldX,
      oldY,
      newX,
      newY,
      letter,
    },
  })
  dispatch(setError({}))
}

export const startGame = () => (dispatch) => {
  http.get('/game/start').then((response) => {
    dispatch({
      type: START_GAME,
      payload: response.data.data,
    })
  })
}

export const makeMove = () => (dispatch, getState) => {
  http.post('/game/move', {
    board: getBoard(getState())
  }).then((response) => {
    console.log(response)
  }).catch((error) => {
    dispatch(setError(error['response']['data']['error']))
  })
}

export const setError = (error) => (dispatch) => {
  dispatch({
    type: SET_ERROR,
    payload: error,
  })
}

export const actions = {
  reset,
  addNewLetterToBoard,
  moveLetter,
  startGame,
  makeMove,
}

// selectors
const getState = (state) => {
  return state['game']
}

const getBoard = (state) => {
  return getState(state)['board']
}

const getGameIsStarted = (state) => {
  return getState(state)['gameStarted']
}

const getMyLetters = (state) => {
  return getState(state)['myLetters']
}

const getError = (state) => {
  return getState(state)['error']
}

export const selectors = {
  getBoard,
  getGameIsStarted,
  getMyLetters,
  getError,
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [RESET]: (state, { payload }) => {
    const newState = { ...state }
    newState['board'] = []
    for (let i = 0; i < 15; i++) {
      newState['board'][i] = []
      for (let j = 0; j < 15; j++) {
        newState['board'][i][j] = {
          letter: null,
        }
      }
    }
    return newState
  },
  [ADD_NEW_LETTER_TO_BOARD]: (state, { payload }) => {
    const newState = { ...state }
    const { x, y, letter, index } = payload
    newState['board'] = []
    state['board'].forEach((_, _y) => {
      newState['board'][_y] = []
      state['board'][_y].forEach((__, _x) => {
        newState['board'][_y][_x] = {
          letter: x === _x && y === _y ? letter : state['board'][_y][_x]['letter'],
          isNew: x === _x && y === _y ? true : state['board'][_y][_x]['isNew'],
        }
      })
    })
    //newState['myLetters'].splice(index, 1);
    return newState
  },
  [MOVE_LETTER]: (state, { payload }) => {
    const newState = { ...state }
    const { oldX, oldY, newX, newY, letter } = payload
    newState['board'] = []
    state['board'].forEach((_, _y) => {
      newState['board'][_y] = []
      state['board'][_y].forEach((__, _x) => {
        if (_y === oldY && _x === oldX) {
          newState['board'][_y][_x] = {
            letter: null,
          }
        } else if (_y === newY && _x === newX) {
          newState['board'][_y][_x] = {
            letter,
            isNew: true,
          }
        } else {
          newState['board'][_y][_x] = {
            ...state['board'][_y][_x]
          }
        }
      })
    })
    return newState
  },
  [START_GAME]: (state, { payload }) => {
    return {
      ...state,
      gameStarted: true,
      myLetters: payload['myLetters'],
      move: payload['move'],
    }
  },
  [SET_ERROR]: (state, { payload }) => {
    return {
      ...state,
      error: payload,
    }
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const getInitialState = () => {
  return {
    board: [],
    gameStarted: false,
    myLetters: [],
    move: -1,
    error: {}
  }
}

export default function userReducer (state = getInitialState(), action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
