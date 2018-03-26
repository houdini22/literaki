import { connect } from 'react-redux'
import PageLayout from './PageLayout'
import { setConnectionErrorModalVisible } from 'reducers/common'

const mapDispatchToProps = {
  setConnectionErrorModalVisible,
}

const mapStateToProps = (state) => ({
  auth: { ...(state.auth) },
  common: { ...(state.common) },
})

export default connect(mapStateToProps, mapDispatchToProps)(PageLayout)
