import React from 'react'
import PropTypes from 'prop-types'
import CSSModules from 'react-css-modules'
import styles from './PageLayout.module.scss'

class PageLayout extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const {children} = this.props
        return (
            <div styleName='layout'>
                {children}
            </div>
        )
    }
}

PageLayout.propTypes = {
    children: PropTypes.node.isRequired,
}

export default CSSModules(PageLayout, styles)
