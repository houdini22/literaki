import { connect } from 'react-redux'
import Index from '../components/Index'
import { bindActionCreators } from 'redux'
import { actions as gameActions, selectors as gameSelectors } from '../../../reducers/game'

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    reset: gameActions.reset,
    addNewLetterToBoard: gameActions.addNewLetterToBoard,
    moveLetter: gameActions.moveLetter,
    startGame: gameActions.startGame,
    makeMove: gameActions.makeMove,
  }, dispatch)
}

const mapStateToProps = (state) => {
  return {
    board: gameSelectors.getBoard(state),
    gameStarted: gameSelectors.getGameIsStarted(state),
    myLetters: gameSelectors.getMyLetters(state),
    error: gameSelectors.getError(state),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Index)
