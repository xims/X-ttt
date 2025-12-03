import React, { Component} from 'react'

export default class LeaderBoard extends Component { 

	constructor (props) {
		super(props)
	}

  render () { 
    const leaderboard = app.settings.leaderboard || []

    return (
      <section id='leader_board'>
        <div id='page-container'>
          <h2 className="leader_board_header">Leader Board</h2>
          <table className='leader_board_table'>
            <thead>
              <tr>
                <th>Name</th>
                <th>Opponent</th>
                <th>Result</th>
                <th>Game</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, index) => (
                <tr key={index}>
                  <td className=''>{entry.name}</td>
                  <td>{entry.opponent}</td>
                  <td>{entry.result}</td>
                  <td>{entry.game}</td>
                  <td>{entry.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    )
  }
}