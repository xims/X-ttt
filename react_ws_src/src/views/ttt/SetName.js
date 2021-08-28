/** @format */

import React, { Component } from "react"

export default class SetName extends Component {
	constructor(props) {
		super(props)

		this.state = {}
	}

	//	------------------------	------------------------	------------------------

	render() {
		return (
			<div id='SetName'>
				<h1>Set Name</h1>

				<div ref='nameHolder' className='input_holder left'>
					<label>Name </label>
					<input
						ref='name'
						type='text'
						className='input name'
						placeholder='Name'
					/>
				</div>

				<div ref='levelHolder' className='input_holder select_option left'>
					<label>Level </label>
					<select ref='level' className='select' placeholder='Select level...'>
						<option value='easy'>Easy</option>
						<option value='medium'>Medium</option>
						<option value='hard'>Hard</option>
					</select>
				</div>

				<button
					type='submit'
					onClick={this.saveName.bind(this)}
					className='button'
				>
					<span>
						SAVE <span className='fa fa-caret-right'></span>
					</span>
				</button>
			</div>
		)
	}

	//	------------------------	------------------------	------------------------

	saveName(e) {
		// const { name } = this.refs
		// const { onSetName } = this.props
		// onSetName(name.value.trim())

		this.props.onSetName(this.refs.name.value.trim())
		this.props.onSetLevel(this.refs.level.value)
	}
}
