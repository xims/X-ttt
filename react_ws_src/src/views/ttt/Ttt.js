import React, { Component} from 'react'
import { Link } from 'react-router'

import SetName from './SetName'
import SetGameType from './SetGameType'

import GameMain from './GameMain'

export default class Ttt extends Component {

	constructor (props) {
		super(props)
	}

//	------------------------	------------------------	------------------------

	render () {

		const {game_step} = this.props.globalState

		console.log(game_step)

		return (
			<section id='TTT_game'>
				<div id='page-container'>
					{game_step == 'set_name' && <SetName 
														onSetName={this.saveUserName.bind(this)} 
												/>}

					{game_step != 'set_name' && 
						<div>
							<h2>Welcome, {app.settings.curr_user.name}</h2>
						</div>
					}

					{game_step == 'set_game_type' && <SetGameType 
														onSetType={this.saveGameType.bind(this)} 
													/>}
					{game_step == 'start_game' && <GameMain 
														game_type={this.props.globalState.game_type}
														onEndGame={this.gameEnd.bind(this)} 
													/>}

				</div>
			</section>
		)
	}

//	------------------------	------------------------	------------------------

	saveUserName (name) {
		app.settings.curr_user = { name }

		this.props.setGlobalState({ game_step: 'set_game_type' })
	}

//	------------------------	------------------------	------------------------

	saveGameType (type) {
		this.props.setGlobalState({ game_step: 'start_game', game_type: type })
	}

//	------------------------	------------------------	------------------------

	gameEnd (t) {
		this.props.setGlobalState({ game_step: 'set_name', game_type: null })
	}

}

//	------------------------	------------------------	------------------------

Ttt.propTypes = {
	params: React.PropTypes.any
}

Ttt.contextTypes = {
  router: React.PropTypes.object.isRequired
}