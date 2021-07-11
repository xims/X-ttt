import React, {Component} from 'react'

export default class SetName extends Component {

	constructor (props) {
		super(props)

		this.state = {
			error: null,
		}
	}

//	------------------------	------------------------	------------------------

	render () {
		return (
			<div id='SetName'>

				<h1>Set Name</h1>

				<div ref='nameHolder' className='input_holder left'>
					<label>Name</label>
					<input ref='name' type='text' className='input name' placeholder='Name' onChange={this.clearError.bind(this)}/>

					{this.state.error && <p>{this.state.error}</p>}
				</div>

				<button
					type='submit'
					onClick={this.saveName.bind(this)}
					className='button'
				>
					<span>
						SAVE{' '}
						<span className='fa fa-caret-right' />
					</span>
				</button>

			</div>
		)
	}

//	------------------------	------------------------	------------------------

	clearError() {
		this.setState({ error: null });
	}

	saveName (e) {
		const name = this.refs.name.value.trim();

		if (name) {
			this.props.onSetName(name)
		} else {
			this.setState({ error: 'Please enter a name'});
			this.refs.name.focus();
		}		
	}
}
