import React from 'react'
import CSSModules from 'react-css-modules'
import styles from './Index.module.scss'
import _ from 'lodash';
import Letter, {letters} from "./Letter";
import {DragDropContextProvider} from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import Cell from "./Cell";
import {Button, Container, Alert} from 'reactstrap'

class IndexView extends React.Component {
    componentDidMount() {
        const {reset} = this.props;
        reset();
    }

    handleDrop(x, y, {letter, isNew}, oldItem, index) {
        const {addNewLetterToBoard, moveLetter} = this.props;
        if (isNew === null) {
            addNewLetterToBoard(x, y, letter, index);
        } else {
            if (oldItem['x'] !== x || oldItem['y'] !== y) {
                moveLetter(oldItem['x'], oldItem['y'], x, y, letter);
            }
        }
    }

    remove(letter, x, y, isNew) {
        if (!isNew) {
            return false;
        }
        alert()
    }

    render() {
        const {board, gameStarted, startGame, myLetters, makeMove, error} = this.props;

        if (board.length === 0) {
            return null;
        }

        return (
            <Container>
                <DragDropContextProvider backend={HTML5Backend}>
                    <div>
                        <div className={styles['board-container']}>
                            <div className={styles['alert-container']}>
                                {!!error.message && (
                                    <Alert color='danger' className={styles['alert']}>{error.message}</Alert>
                                )}
                            </div>
                            <div className={styles['board']}>
                                {_.range(15).map((y) => {
                                    return (
                                        <div className={styles['board-row']} key={`y-${y}`}>
                                            {_.range(15).map((x) => {
                                                return (
                                                    <Cell
                                                        x={x}
                                                        y={y}
                                                        key={`y-${y}--x-${x}--${board[y][x]['letter']}`}
                                                        onDrop={item => {
                                                            this.handleDrop(x, y, item, {
                                                                x: item['x'],
                                                                y: item['y']
                                                            }, item['index'])
                                                        }}
                                                    >
                                                        {board[y][x]['letter'] !== null && (
                                                            <Letter
                                                                letter={board[y][x]['letter']}
                                                                x={x}
                                                                y={y}
                                                                isNew={board[y][x]['isNew']}
                                                            />
                                                        )}
                                                    </Cell>
                                                );
                                            })}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        <div className={styles['bottom-container']}>
                            {gameStarted && (
                                <div className={styles['letters-container']}>
                                    {letters.map((letter, index) => {
                                        return (
                                            <Letter letter={letter.letter} index={index} key={Math.random()}/>
                                        )
                                    })}
                                    <div>
                                        <Button onClick={() => makeMove()}>AKCEPTUJ</Button>
                                    </div>
                                </div>
                            )}
                            {!gameStarted && (
                                <Button onClick={() => startGame()}>START</Button>
                            )}
                        </div>

                    </div>
                </DragDropContextProvider>
            </Container>
        )
    }
}

export default CSSModules(IndexView, styles)
