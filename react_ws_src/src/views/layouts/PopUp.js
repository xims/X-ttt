// import React, { Component } from 'react'
import React, { useState, useEffect } from 'react'
import getBodyHeight from '../../helpers/getBodyHeight'
import { Motion, spring } from 'react-motion'

// export default class PopUp extends Component {
const PopUp = props => {

  const [bodyHeight, setBodyHeight] = useState(0)
  const [closing, setClosing] = useState(false)
  const [mounted, setMounted] = useState(false)

  // constructor (props) {
  //   super(props)
  //   this.state = {
  //     bodyHeight: 0,
  //     closing: false,
  //     mounted: false
  //   }
  // }

  // componentDidMount () {
  //   this.setState({
  //     bodyHeight: getBodyHeight()+200,
  //     mounted: true
  //   })
  // }

  useEffect(() => {
    setBodyHeight(getBodyHeight()+200)
    setMounted(true)
  });

  const closeMe = () => {
    setClosing(true)
    // this.setState({ closing: true })
    this.context.router.push('/')
  }

  // render () {
    // const me = this
    // const { mounted, closing, bodyHeight } = this.state
    const bottom = closing ? -bodyHeight : 0
    const springValue = [120, 15]

    if (!mounted) return null

    return (

      <Motion
        defaultStyle={{bottom: -bodyHeight}}
        style={{bottom: spring(bottom, springValue)}}>
        {
          (value) => (
            <section id='simple_popup' style={{bottom: value.bottom}}>
              <div className='container'>
                <a className='close fa fa-close' onClick={() => closeMe}></a>
                <h3>{ this.props.pageTitle } </h3>
              </div>
              <div className='content'>
                <div className='container'>
                  { this.props.children }
                </div>
              </div>
            </section>
          )
        }
      </Motion>
    )
  // }

}

PopUp.propTypes = {
  pageTitle: React.PropTypes.string,
  children: React.PropTypes.any
}

PopUp.contextTypes = {
  router: React.PropTypes.object.isRequired
}

export default PopUp;