import React, {Component} from 'react';
import TweenMax from 'gsap'

export default class ScoreBoard extends Component {
 
  constructor (props) {
    super(props);
  }
  
  componentDidMount () {
    TweenMax.from('#scoreboard', 1, {opacity: 0, y:-100, ease: Power4.easeIn})
  }


  render () {
    return (
      <div id="scoreboard">
        <h3>Scores</h3>
        <div id="scoreboard_table">
          <div className="score_row">
             <div className="player_name">{this.props.player1_name}</div>
             <div className="player_score">{this.props.player1_score}</div>
          </div>
          <div className="score_row">
             <div className="player_name">{this.props.player2_name}</div>
             <div className="player_score">{this.props.player2_score}</div>
          </div>
          <div className="score_row">
             <div className="player_name">Draws</div>
             <div className="player_score">{this.props.draw_score}</div>
          </div>
        </div>
      </div>
    )
  }
}
