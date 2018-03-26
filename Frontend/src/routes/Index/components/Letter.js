import React from 'react'
import CSSModules from 'react-css-modules'
import PropTypes from 'prop-types';
import styles from './Index.module.scss'
import classNames from 'classnames';
import _ from 'lodash';
import {DragSource} from 'react-dnd'

export const letters = [
    {letter: 'a', points: 1},
    {letter: 'ą', points: 5},
    {letter: 'b', points: 3},
    {letter: 'c', points: 2},
    {letter: 'ć', points: 5},
    {letter: 'd', points: 2},
    {letter: 'e', points: 1},
    {letter: 'ę', points: 5},
    {letter: 'f', points: 5},
    {letter: 'g', points: 3},
    {letter: 'h', points: 3},
    {letter: 'i', points: 1},
    {letter: 'j', points: 3},
    {letter: 'k', points: 2},
    {letter: 'l', points: 2},
    {letter: 'ł', points: 3},
    {letter: 'm', points: 2},
    {letter: 'n', points: 1},
    {letter: 'ń', points: 5},
    {letter: 'o', points: 1},
    {letter: 'ó', points: 5},
    {letter: 'p', points: 2},
    {letter: 'r', points: 1},
    {letter: 's', points: 1},
    {letter: 'ś', points: 5},
    {letter: 't', points: 2},
    {letter: 'u', points: 3},
    {letter: 'w', points: 1},
    {letter: 'y', points: 2},
    {letter: 'z', points: 1},
    {letter: 'ź', points: 5},
    {letter: 'ż', points: 5},
    {letter: '_', points: 0},
];

const dndSource = {
    beginDrag(props) {
        const {letter, x, y, isNew, index} = props;
        return {
            letter,
            x,
            y,
            isNew: _.isUndefined(isNew) ? null : true,
            index,
        }
    },
};

@DragSource("letter", dndSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
}))
class Letter extends React.Component {
    static propTypes = {
        connectDragSource: PropTypes.func.isRequired,
        isDragging: PropTypes.bool.isRequired,
        name: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        isDropped: PropTypes.bool.isRequired,
        letter: PropTypes.string.isRequired,
        x: PropTypes.number,
        y: PropTypes.number,
        isNew: PropTypes.bool,
        index: PropTypes.number.isRequired,
    };

    render() {
        const {letter, isDragging, connectDragSource} = this.props;
        const definition = letters.find((l) => {
            return l.letter === letter
        });
        const opacity = isDragging ? 0.4 : 1;

        return connectDragSource(
            <div
                className={classNames({
                    [styles['letter']]: true,
                    [styles['letter--1']]: definition['points'] === 1,
                    [styles['letter--2']]: definition['points'] === 2,
                    [styles['letter--3']]: definition['points'] === 3,
                    [styles['letter--5']]: definition['points'] === 5,
                    [styles['letter--blank']]: definition['points'] === 0,
                })}
                style={{opacity}}
            >
                <div className={styles['letter__background']}/>
                <span>{letter !== '_' && letter}</span>
            </div>
        )
    }
}

export default CSSModules(Letter, styles)
