import React, {Component} from 'react'


export default class Score extends Component {

	render () {
		return (
      <ul className="flexrowstart" style={{ width: '390px', marginTop: '1.5rem' }}>
        <li className="flexitemnone centre-centre" style={{ width: '50%' }}>
          <h2>{app.settings.curr_user.name}</h2>
          <h2>{this.props.scoreboard.you}</h2>
        </li>
        <li className="flexitemauto centre-centre">
          <h2>{this.props.opponent_name}</h2>
          <h2>{this.props.scoreboard.opponent}</h2>
        </li>
      </ul>
		)
	}

}
