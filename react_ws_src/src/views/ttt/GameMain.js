import React, {Component} from 'react'

import io from 'socket.io-client'

import TweenMax from 'gsap'

import rand_arr_elem from '../../helpers/rand_arr_elem'
import rand_to_fro from '../../helpers/rand_to_fro'

import ScoreBoard from './ScoreBoard'
import check_win_status from '../../helpers/check_win_status'

export default class GameMain extends Component { 

	constructor (props) {
		super(props)

		


		if (this.props.game_type != 'live')
			this.state = {
				cell_vals: {},
				next_turn_ply: true,
				game_play: true,
				game_stat: 'Start game',
				player1_name: app.settings.curr_user.name || 'Player 1',
				player1_score: 0,
				player2_name: 'Computer',
				player2_score: 0,
				draw_score: 0,
			}
		else {
			this.sock_start()

			this.state = {
				cell_vals: {},
				next_turn_ply: true,
				game_play: false,
				game_stat: 'Waiting for opponent...',
				player1_name: app.settings.curr_user.name || 'Player 1',
				player2_name: 'Player 2',
				player1_score: 0,
				player2_score: 0,
				draw_score: 0
			}
		}
	}

//	------------------------	------------------------	------------------------

	componentDidMount () {
    	TweenMax.from('#game_stat', 1, {display: 'none', opacity: 0, scaleX:0, scaleY:0, ease: Power4.easeIn})
    	TweenMax.from('#game_board', 1, {display: 'none', opacity: 0, x:-200, y:-200, scaleX:0, scaleY:0, ease: Power4.easeIn})
	}

//	------------------------	------------------------	------------------------
//	------------------------	------------------------	------------------------

	sock_start () {

		this.socket = io(app.settings.ws_conf.loc.SOCKET__io.u);

		this.socket.on('connect', function(data) { 
			// console.log('socket connected', data)

			this.socket.emit('new player', { 
				name: app.settings.curr_user.name,
				board_size: this.props.board_size || 3  // pass the board size to the server for matching players
			});

		}.bind(this));

		this.socket.on('pair_players', function(data) { 
			// console.log('paired with ', data)

			this.setState({
				next_turn_ply: data.mode=='m',
				game_play: true,
				game_stat: 'Playing with ' + data.opp.name,
				player2_name: data.opp.name, 
				board_size: data.board_size || 3  // get the board size from the server for the game

			})

		}.bind(this));


		this.socket.on('opp_turn', this.turn_opp_live.bind(this));



	}

//	------------------------	------------------------	------------------------
//	------------------------	------------------------	------------------------

	componentWillUnmount () {

		this.socket && this.socket.disconnect();
	}

//	------------------------	------------------------	------------------------

	cell_cont (c) {
		const { cell_vals } = this.state

		return (<div>
		        	{cell_vals && cell_vals[c]=='x' && <i className="fa fa-times fa-5x"></i>}
					{cell_vals && cell_vals[c]=='o' && <i className="fa fa-circle-o fa-5x"></i>}
				</div>)
	}


	generate_game_board () {
    const grid_size = this.props.board_size;
    const cell_vals = this.state.cell_vals;
    const grid = [];
    for( let i=1; i<=grid_size*grid_size; i++) {
			const cellId = `c${i}`;
      grid.push(<div key={cellId} id={cellId} ref={cellId} className="cell" onClick={ (e) => this.on_cell_click(e, cellId)}>
        <div className="cell-content">
					{cell_vals && cell_vals[cellId] === 'x'&& <i className="fa fa-times fa-5x"></i>}
        	{cell_vals && cell_vals[cellId] === 'o' && <i className="fa fa-circle-o fa-5x"></i>}
				</div>
      </div>)
    }
    return <div id="dynamic_game_board" style={{ 
      gridTemplateColumns: `repeat(${grid_size}, 1fr)`,
      gridTemplateRows: `repeat(${grid_size}, 1fr)`,
    }}>{grid}</div>;
  }

//	------------------------	------------------------	------------------------

	render () {
		const { cell_vals } = this.state

		return (
			<div id='GameMain'>

				<h1>Play {this.props.game_type}</h1>

				<div id="game_stat">
					<div id="game_stat_msg">{this.state.game_stat}</div>
					{this.state.game_play && <div id="game_turn_msg">{this.state.next_turn_ply ? 'Your turn' : 'Opponent turn'}</div>}
				</div>

				<div id="game_board">
	
					{this.generate_game_board()}
				</div>
				{ this.props.game_type !== 'live' && 
				<ScoreBoard player1_name={this.state.player1_name} player2_name={this.state.player2_name} player1_score={this.state.player1_score} player2_score={this.state.player2_score} draw_score={this.state.draw_score} />
				}
		
				{ this.props.game_type !== 'live' && !this.state.game_play && 
				<button type="button" onClick={this.restart.bind(this)} className='button mr'><span>Restart <span className='fa fa-rotate-left'></span></span></button>} 
				
				<button type='submit' onClick={this.end_game.bind(this)} className='button'><span>End Game <span className='fa fa-caret-right'></span></span></button> 
        
			</div>
		)
	}

//	------------------------	------------------------	------------------------
//	------------------------	------------------------	------------------------

	on_cell_click (e, cellId) {
		// if its not player's turn or the game is not playing, do nothing
    if(!this.state.next_turn_ply || !this.state.game_play) return

		const cell_id = e.currentTarget.id
   
		if(this.state.cell_vals[cell_id]) return

		if(this.props.game_type != 'live') {
			this.turn_ply_comp(cell_id)
		} else {
			this.turn_ply_live(cell_id)
		} 

	}

//	------------------------	------------------------	------------------------
//	------------------------	------------------------	------------------------

	turn_ply_comp (cell_id) {

		let { cell_vals } = this.state

		cell_vals[cell_id] = 'x'

		TweenMax.from(document.getElementById(cell_id).querySelector('.cell-content'), 0.7, {opacity: 0, scaleX:0, scaleY:0, ease: Power4.easeOut})

		this.state.cell_vals = cell_vals

		this.check_turn()
	}

//	------------------------	------------------------	------------------------

	turn_comp () {

		let { cell_vals } = this.state
		let empty_cells_arr = []


		for (let i=1; i<=this.props.board_size*this.props.board_size; i++) 
			!cell_vals['c'+i] && empty_cells_arr.push('c'+i)
		// console.log(cell_vals, empty_cells_arr, rand_arr_elem(empty_cells_arr))

		const c = rand_arr_elem(empty_cells_arr)
		cell_vals[c] = 'o'

		TweenMax.from(document.getElementById(c).querySelector('.cell-content'), 0.7, {opacity: 0, scaleX:0, scaleY:0, ease: Power4.easeOut})


		// this.setState({
		// 	cell_vals: cell_vals,
		// 	next_turn_ply: true
		// })

		this.state.cell_vals = cell_vals

		this.check_turn()
	}


//	------------------------	------------------------	------------------------
//	------------------------	------------------------	------------------------

	turn_ply_live (cell_id) {

		let { cell_vals } = this.state

		cell_vals[cell_id] = 'x'

		TweenMax.from(document.getElementById(cell_id).querySelector('.cell-content'), 0.7, {opacity: 0, scaleX:0, scaleY:0, ease: Power4.easeOut})

		this.socket.emit('ply_turn', { cell_id: cell_id });

		// this.setState({
		// 	cell_vals: cell_vals,
		// 	next_turn_ply: false
		// })

		// setTimeout(this.turn_comp.bind(this), rand_to_fro(500, 1000));

		this.state.cell_vals = cell_vals

		this.check_turn()
	}

//	------------------------	------------------------	------------------------

	turn_opp_live (data) {

		let { cell_vals } = this.state
		let empty_cells_arr = []


		const c = data.cell_id
		cell_vals[c] = 'o'

		TweenMax.from(this.refs[c], 0.7, {opacity: 0, scaleX:0, scaleY:0, ease: Power4.easeOut})


		// this.setState({
		// 	cell_vals: cell_vals,
		// 	next_turn_ply: true
		// })

		this.state.cell_vals = cell_vals

		this.check_turn()
	}

//	------------------------	------------------------	------------------------
//	------------------------	------------------------	------------------------
//	------------------------	------------------------	------------------------

	check_turn () {

		const { cell_vals } = this.state

		let userWin = false;
		let oppWin = false;
		let draw = false;

		//console.log("check turn");

		if (this.props.game_type!='live') {
			this.state.game_stat = 'Play'
		}

		// check if the game is over
	//	console.log("checking win status for cell vals: ", cell_vals);
		const winning_cells = check_win_status(cell_vals, this.props.board_size);


		if(winning_cells.length > 0) {
			if(cell_vals[winning_cells[0]] === 'x') {
				userWin = true;
			} else {
				oppWin = true;
			}
		}

		const grid_size = this.props.board_size * this.props.board_size;

		// check if the game is a draw	
		if(!userWin && !oppWin && grid_size === Object.keys(cell_vals).length) {
			draw = true;
		}

		if(userWin || oppWin) {  // either player wins
			this.setState({
				game_stat :(userWin ? 'You Won! :)' : 'Opponent Won! :('),
				game_play: false,
			});

			userWin ? this.update_score('player1', this.state.player1_score + 1) : this.update_score('player2', this.state.player2_score + 1);
      
			//disconnect socket for live game
			this.socket && this.socket.disconnect();

		} else if (draw) { // draw
			this.setState( {
				game_stat: 'Draw',
				game_play: false,
			});

			this.update_score('draw', this.state.draw_score + 1);

			this.socket && this.socket.disconnect();

		} else { // continue game
			this.props.game_type!='live' && this.state.next_turn_ply && setTimeout(this.turn_comp.bind(this), rand_to_fro(500, 1000));

			this.setState({
				next_turn_ply: !this.state.next_turn_ply
			})
		}

		

		/* let win = false
		let set
		let fin = true

		if (this.props.game_type!='live')
			this.state.game_stat = 'Play'


		for (let i=0; !win && i<this.win_sets.length; i++) {
			set = this.win_sets[i]
			if (cell_vals[set[0]] && cell_vals[set[0]]==cell_vals[set[1]] && cell_vals[set[0]]==cell_vals[set[2]])
				win = true
		}


		for (let i=1; i<=9; i++) 
			!cell_vals['c'+i] && (fin = false)

		// win && console.log('win set: ', set)

		if (win) {
		
			this.refs[set[0]].classList.add('win')
			this.refs[set[1]].classList.add('win')
			this.refs[set[2]].classList.add('win')

			TweenMax.killAll(true)
			TweenMax.from('td.win', 1, {opacity: 0, ease: Linear.easeIn})
      
      const userWin = cell_vals[set[0]] === 'x';

			this.setState({
				game_stat: (userWin ? 'You' : 'Opponent')+' win',
				game_play: false
				
			});
			userWin ? this.update_score('player1', this.state.player1_score + 1) : this.update_score('player2', this.state.player2_score + 1);

			this.socket && this.socket.disconnect();

		} else if (fin) {
		
			this.setState({
				game_stat: 'Draw',
				game_play: false
			})
			this.update_score('draw', this.state.draw_score + 1);

			this.socket && this.socket.disconnect();

		} else {
			this.props.game_type!='live' && this.state.next_turn_ply && setTimeout(this.turn_comp.bind(this), rand_to_fro(500, 1000));

			this.setState({
				next_turn_ply: !this.state.next_turn_ply
			})
		} */
		
	}

//	------------------------	------------------------	------------------------

	end_game () {
		this.socket && this.socket.disconnect();

		this.props.onEndGame()
	}

	restart () {
		// only reset the board if its a local game vs computer
		if (this.props.game_type != 'live') { 
			this.reset_board();
		}
	}

	reset_board () {
		// remove any 'win' classed added to the cells
		for(let i=0; i<9; i++) {
			this.refs['c'+(i+1)].classList.remove('win')
		}

		// reset the board to clean state, add a tween to fade out as visual cue
		TweenMax.to('#game_board', 0.3, {opacity: 0, onComplete: () => {
			this.setState({
					cell_vals: {},
					next_turn_ply: true, // player always goes first 
					game_play: true,
					game_stat: 'Start game'
			})
			TweenMax.to('#game_board', 0.3, {opacity: 1})
		}});
	}

	update_score (player, score){
		this.setState({
			[player + '_score']: score
		});
	}

}
