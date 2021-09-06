// import React, {Component} from 'react'
import React from 'react'

const MainContent = ({children}) => {

	// constructor (props) {
	// 	super(props)
	// }

	// render () {
		return (
			<section id='main_content'>
				<div className='main_container'>
					{children}
					{/* {this.props.children} */}
				</div>
			</section>
		)
	// }
}

MainContent.propTypes = {
	children: React.PropTypes.any
}

export default MainContent;