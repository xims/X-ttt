import React, {Component} from 'react'

import Button from '../../components/Button'

export default class SetGameType extends Component {

	constructor (props) {
		super(props)

		this.state = {}
	}

//	------------------------	------------------------	------------------------

	render () {
		return (
			<div id='SetGameType'>

				<h1>Choose game type</h1>

				<Button long onClick={this.selTypeLive.bind(this)}>Live against another player</Button>
				
				&nbsp;&nbsp;&nbsp;&nbsp;

				<Button long onClick={this.selTypeComp.bind(this)}>Against a computer</Button>

			</div>
		)
	}

//	------------------------	------------------------	------------------------

	selTypeLive (e) {
		// const { name } = this.refs
		// const { onSetType } = this.props
		// onSetType(name.value.trim())

		this.props.onSetType('live')
	}

//	------------------------	------------------------	------------------------

	selTypeComp (e) {
		// const { name } = this.refs
		// const { onSetType } = this.props
		// onSetType(name.value.trim())

		this.props.onSetType('comp')
	}

}
