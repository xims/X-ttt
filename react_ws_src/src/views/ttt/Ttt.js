import React, { Component} from 'react'
import { Link } from 'react-router'

import SetName from './SetName'
import SetGameType from './SetGameType'

import GameMain from './GameMain'

export default class Ttt extends Component {

	constructor (props) {
		super(props)

		this.state = {
			game_step: this.set_game_step()
		}
	}

//	------------------------	------------------------	------------------------

	render () {

		const {game_step} = this.state

		console.log(game_step)

		return (
			<section id='TTT_game'>
				<div id='page-container'>
					{game_step == 'set_name' && <SetName 
														onSetName={this.saveUserName.bind(this)}
														initialName={app.settings.curr_user && app.settings.curr_user.name}
														initialAvatar={app.settings.curr_user && app.settings.curr_user.avatar}
												/>}

					{game_step != 'set_name' && 
						<div className='welcome_step_wrapper'>
							{game_step == 'set_game_type' && (
								<button
									type='button'
									className='back_to_name_btn'
									onClick={this.goBackToSetName.bind(this)}
									aria-label='Back to edit name and avatar'
								>
									<span className='fa fa-arrow-left' />
								</button>
							)}
							<h2>Welcome, {app.settings.curr_user.name}</h2>
						</div>
					}

					{game_step == 'set_game_type' && <SetGameType 
														onSetType={this.saveGameType.bind(this)} 
													/>}
					{game_step == 'start_game' && <GameMain 
														game_type={this.state.game_type}
														grid_size={this.state.grid_size || 3}
														onEndGame={this.gameEnd.bind(this)} 
													/>}

				</div>
			</section>
		)
	}

//	------------------------	------------------------	------------------------

	goBackToSetName () {
		this.setState({ game_step: 'set_name' })
	}

//	------------------------	------------------------	------------------------

	saveUserName (n, a) {
		app.settings.curr_user = {}
		app.settings.curr_user.name = n
		app.settings.curr_user.avatar = a

		this.upd_game_step()
	}

//	------------------------	------------------------	------------------------

	saveGameType (t, gridSize) {
		this.state.game_type = t
		this.state.grid_size = gridSize || 3

		this.upd_game_step()
	}

//	------------------------	------------------------	------------------------

	gameEnd (t) {
		this.state.game_type = null
		this.state.grid_size = null

		this.upd_game_step()
	}

//	------------------------	------------------------	------------------------
//	------------------------	------------------------	------------------------

	upd_game_step () {

		this.setState({
			game_step: this.set_game_step()
		})
	}

//	------------------------	------------------------	------------------------

	set_game_step () {

		if (!app.settings.curr_user || !app.settings.curr_user.name)
			return 'set_name'
		else if (!this.state.game_type)
			return 'set_game_type'
		else
			return 'start_game'
	}

}

//	------------------------	------------------------	------------------------

Ttt.propTypes = {
	params: React.PropTypes.any
}

Ttt.contextTypes = {
  router: React.PropTypes.object.isRequired
}