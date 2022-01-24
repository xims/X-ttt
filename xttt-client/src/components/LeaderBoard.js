//externals
import React, { Component } from 'react'

//styles
import './LeaderBoard.scss'
export default class LeaderBoard extends React.Component {
    render() {
        return (
            <div className="leader-board-contanier">
                <h3>Leaderboard</h3>
                <div>
                    {this.props.playerOne}:{this.props.playerOneWins} |{' '}
                    {this.props.playerTwo}:{this.props.playerTwoWins}
                </div>
            </div>
        )
    }
}
