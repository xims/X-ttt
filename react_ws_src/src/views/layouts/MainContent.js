import React, {Component} from 'react'

export default class MainContent extends Component {

	constructor (props) {
		super(props)
		this.state= {
			theme:'Blue'
		}
		this.handleTheme = this.handleTheme.bind(this);
	}

	handleTheme(id){
		this.setState({ theme:id })
	}
	render () {
		return (
			<section id='main_content' className= {`theme${this.state.theme}`}>
				<div className='main_container'>
					{this.props.children}
				</div>
				<div className="btnWrapper">
					<button className="btnRed btn"  onClick={ () => this.handleTheme("Red")}/>
					<button className="btnBlue btn" onClick={ () => this.handleTheme("Blue")}/>
				</div>
			</section>
		)
	}
}

MainContent.propTypes = {
	children: React.PropTypes.any
}
