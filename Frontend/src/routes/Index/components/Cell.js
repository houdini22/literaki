import React from 'react'
import CSSModules from 'react-css-modules'
import PropTypes from 'prop-types'
import styles from './Index.module.scss'
import classNames from 'classnames'
import _ from 'lodash'
import { DropTarget } from 'react-dnd'

const redFields = [
  { 'x': 0, 'y': 0 },
  { 'x': 7, 'y': 0 },
  { 'x': 14, 'y': 0 },
  { 'x': 6, 'y': 1 },
  { 'x': 8, 'y': 1 },
  { 'x': 1, 'y': 6 },
  { 'x': 13, 'y': 6 },
  { 'x': 0, 'y': 7 },
  { 'x': 14, 'y': 7 },
  { 'x': 1, 'y': 8 },
  { 'x': 13, 'y': 8 },
  { 'x': 6, 'y': 13 },
  { 'x': 8, 'y': 13 },
  { 'x': 0, 'y': 14 },
  { 'x': 7, 'y': 14 },
  { 'x': 14, 'y': 14 },
  { 'x': 7, 'y': 7 },
]

const greenFields = [
  { 'x': 5, 'y': 0 },
  { 'x': 9, 'y': 0 },
  { 'x': 4, 'y': 1 },
  { 'x': 10, 'y': 1 },
  { 'x': 3, 'y': 2 },
  { 'x': 11, 'y': 2 },
  { 'x': 2, 'y': 3 },
  { 'x': 12, 'y': 3 },
  { 'x': 1, 'y': 4 },
  { 'x': 13, 'y': 4 },
  { 'x': 0, 'y': 5 },
  { 'x': 14, 'y': 5 },
  { 'x': 0, 'y': 9 },
  { 'x': 14, 'y': 9 },
  { 'x': 13, 'y': 10 },
  { 'x': 1, 'y': 10 },
  { 'x': 12, 'y': 11 },
  { 'x': 2, 'y': 11 },
  { 'x': 11, 'y': 12 },
  { 'x': 3, 'y': 12 },
  { 'x': 10, 'y': 13 },
  { 'x': 4, 'y': 13 },
  { 'x': 9, 'y': 14 },
  { 'x': 5, 'y': 14 },
]

const yellowFiels = [
  { 'x': 7, 'y': 2 },
  { 'x': 6, 'y': 3 },
  { 'x': 8, 'y': 3 },
  { 'x': 5, 'y': 4 },
  { 'x': 9, 'y': 4 },
  { 'x': 4, 'y': 5 },
  { 'x': 10, 'y': 5 },
  { 'x': 3, 'y': 6 },
  { 'x': 11, 'y': 6 },
  { 'x': 2, 'y': 7 },
  { 'x': 12, 'y': 7 },
  { 'x': 11, 'y': 8 },
  { 'x': 3, 'y': 8 },
  { 'x': 10, 'y': 9 },
  { 'x': 4, 'y': 9 },
  { 'x': 9, 'y': 10 },
  { 'x': 5, 'y': 10 },
  { 'x': 8, 'y': 11 },
  { 'x': 6, 'y': 11 },
  { 'x': 7, 'y': 12 },
]

const blueFiels = [
  { 'x': 7, 'y': 5 },
  { 'x': 6, 'y': 6 },
  { 'x': 8, 'y': 6 },
  { 'x': 5, 'y': 7 },
  { 'x': 9, 'y': 7 },
  { 'x': 6, 'y': 8 },
  { 'x': 8, 'y': 8 },
  { 'x': 7, 'y': 9 },
]

const doubleFields = [
  { 'x': 5, 'y': 2 },
  { 'x': 9, 'y': 2 },
  { 'x': 4, 'y': 3 },
  { 'x': 10, 'y': 3 },
  { 'x': 3, 'y': 4 },
  { 'x': 11, 'y': 4 },
  { 'x': 2, 'y': 5 },
  { 'x': 12, 'y': 5 },
  { 'x': 2, 'y': 9 },
  { 'x': 12, 'y': 9 },
  { 'x': 3, 'y': 10 },
  { 'x': 11, 'y': 10 },
  { 'x': 4, 'y': 11 },
  { 'x': 10, 'y': 11 },
  { 'x': 5, 'y': 12 },
  { 'x': 9, 'y': 12 },
]

const tripleFields = [
  { 'x': 2, 'y': 0 },
  { 'x': 12, 'y': 0 },
  { 'x': 0, 'y': 2 },
  { 'x': 14, 'y': 2 },
  { 'x': 0, 'y': 12 },
  { 'x': 14, 'y': 12 },
  { 'x': 2, 'y': 14 },
  { 'x': 12, 'y': 14 },
]

const inArray = (array, obj) => {
  let result = false
  array.forEach((el) => {
    if (obj['x'] === el['x'] && obj['y'] === el['y']) {
      result = true
    }
  })
  return result
}

const dndTarget = {
  drop (props, monitor) {
    props.onDrop(monitor.getItem())
  },
}

@DropTarget('letter', dndTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
}))
class Cell extends React.Component {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired,
    lastDroppedItem: PropTypes.object,
    onDrop: PropTypes.func.isRequired,
  }

  render () {
    const {
      accepts,
      isOver,
      canDrop,
      connectDropTarget,
      lastDroppedItem,
      x,
      y,
      children,
    } = this.props
    const isActive = isOver && canDrop
    const cellClass = classNames({
      [styles['board-cell']]: true,
      [styles['board-cell--is-active']]: isActive,
    })
    const backgroundClass = classNames({
      [styles['board-cell-background']]: true,
      [styles['board-cell-background--red']]: inArray(redFields, { x, y }),
      [styles['board-cell-background--green']]: inArray(greenFields, { x, y }),
      [styles['board-cell-background--yellow']]: inArray(yellowFiels, { x, y }),
      [styles['board-cell-background--blue']]: inArray(blueFiels, { x, y }),
      [styles['board-cell-background--double']]: inArray(doubleFields, { x, y }),
      [styles['board-cell-background--triple']]: inArray(tripleFields, { x, y }),
    })

    return connectDropTarget(
      <div className={cellClass}>
        <div className={backgroundClass}/>
        <div className={styles['board-cell-content']}>
          {children}
        </div>
      </div>
    )
  }
}

export default CSSModules(Cell, styles)
