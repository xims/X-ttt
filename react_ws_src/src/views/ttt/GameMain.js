import React, {Component} from 'react'

import io from 'socket.io-client'

import TweenMax from 'gsap'

import rand_arr_elem from '../../helpers/rand_arr_elem'
import rand_to_fro from '../../helpers/rand_to_fro'

export default class SetName extends Component {

	constructor (props) {
		super(props)

		this.board = [
			[1, 2, 3],
			[4, 5, 6],
			[7, 8, 9],
		]

		this.win_sets = [
			['c1', 'c2', 'c3'],
			['c4', 'c5', 'c6'],
			['c7', 'c8', 'c9'],

			['c1', 'c4', 'c7'],
			['c2', 'c5', 'c8'],
			['c3', 'c6', 'c9'],

			['c1', 'c5', 'c9'],
			['c3', 'c5', 'c7']
		]

		this.win_map = [
			{'c1':null, 'c2':null, 'c3':null, filled: 0},
			{'c4':null, 'c5':null, 'c6':null, filled: 0},
			{'c7':null, 'c8':null, 'c9':null, filled: 0},

			{'c1':null, 'c4':null, 'c7':null, filled: 0},
			{'c2':null, 'c5':null, 'c8':null, filled: 0},
			{'c3':null, 'c6':null, 'c9':null, filled: 0},

			{'c1':null, 'c5':null, 'c9':null, filled: 0},
			{'c3':null, 'c5':null, 'c7':null, filled: 0}
		]


		if (this.props.game_type != 'live')
			this.state = {
				cell_vals: {},
				next_turn_ply: true,
				game_play: true,
				game_stat: 'Start game'
			}
		else {
			this.sock_start()

			this.state = {
				cell_vals: {},
				next_turn_ply: true,
				game_play: false,
				game_stat: 'Connecting'
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

			this.socket.emit('new player', { name: app.settings.curr_user.name });

		}.bind(this));

		this.socket.on('pair_players', function(data) { 
			// console.log('paired with ', data)

			this.setState({
				next_turn_ply: data.mode=='m',
				game_play: true,
				game_stat: 'Playing with ' + data.opp.name
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

//	------------------------	------------------------	------------------------

	render () {
		const { cell_vals } = this.state
		// console.log(cell_vals)

		return (
			<div id='GameMain'>

				<h1>Play {this.props.game_type}</h1>

				<div id="game_stat">
					<div id="game_stat_msg">{this.state.game_stat}</div>
					{this.state.game_play && <div id="game_turn_msg">{this.state.next_turn_ply ? 'Your turn' : 'Opponent turn'}</div>}
				</div>

				<div id="game_board">
					<table>
					<tbody>
						{this.board.map((items, index) => (
							<tr key={index}>
								{items.map((cell) => {
									const itemCont = `c${cell}`;
									return (
									<td key={itemCont} id={`game_board-${itemCont}`} ref={itemCont} onClick={this.click_cell.bind(this)}> 
										{this.cell_cont(itemCont)} 
									</td>
								)})}
							</tr>
						))}
					</tbody>
					</table>
				</div>

				<button type='submit' onClick={this.end_game.bind(this)} className='button'><span>End Game <span className='fa fa-caret-right'></span></span></button>

			</div>
		)
	}

//	------------------------	------------------------	------------------------
//	------------------------	------------------------	------------------------

	click_cell (e) {
		// console.log(e.currentTarget.id.substr(11))
		// console.log(e.currentTarget)

		if (!this.state.next_turn_ply || !this.state.game_play) return

		const cell_id = e.currentTarget.id.substr(11)
		if (this.state.cell_vals[cell_id]) return

		if (this.props.game_type != 'live')
			this.turn_ply_comp(cell_id)
		else
			this.turn_ply_live(cell_id)
	}

//	------------------------	------------------------	------------------------
//	------------------------	------------------------	------------------------

	turn_ply_comp (cell_id) {

		let { cell_vals } = this.state

		cell_vals[cell_id] = 'x'
		this.set_move(cell_id, 'x');

		TweenMax.from(this.refs[cell_id], 0.7, {opacity: 0, scaleX:0, scaleY:0, ease: Power4.easeOut})


		// this.setState({
		// 	cell_vals: cell_vals,
		// 	next_turn_ply: false
		// })

		// setTimeout(this.turn_comp.bind(this), rand_to_fro(500, 1000));

		this.state.cell_vals = cell_vals

		this.check_turn()
	}

//	------------------------	------------------------	------------------------
	set_move (cell, player) {
		this.win_map.map((item) => {
			if (item.hasOwnProperty(cell)) {
        		item[cell] = player;
				item.filled++;
      		}
		});
	}

	turn_comp () {

		let { cell_vals } = this.state

		let selectedCellX = null;
		let selectedCellO = null;
		let selectedCell = null;
		let emptyCells = [];
		this.win_map.forEach((item) => {
			if (item.filled > 1) { // possible to lose or win
				let xCount = 0;
				let oCount = 0;
				Object.keys(item).forEach((key) => {
					if(item[key] === 'x') xCount++;
					if(item[key] === 'o') oCount++;
					if(item[key] === null){
						selectedCell = key;
					}
				})
				if (xCount > 1 ) { // prevent losing or win the game
					selectedCellX = selectedCell;
				}
				if ( oCount > 1 ) { // prevent losing or win the game
					selectedCellO = selectedCell;
				}
			} 
			
		});

		if (selectedCellX) { // first priority
			selectedCell = selectedCellX;
    	} else if (selectedCellO){
			selectedCell = selectedCellO;
		}
		if (!selectedCell) {
			this.win_map.find((item) => {
				Object.keys(item).forEach((key) => {
					if (item[key] === null) {
						emptyCells.push(key);
					}
				});
				if (emptyCells.includes('c5')) {
					return selectedCell = 'c5';
				}
			});
			selectedCell = rand_arr_elem(emptyCells);
		}

		cell_vals[selectedCell] = 'o'
		this.set_move(selectedCell, 'o');
        
		TweenMax.from(this.refs[selectedCell], 0.7, {opacity: 0, scaleX:0, scaleY:0, ease: Power4.easeOut})


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

		TweenMax.from(this.refs[cell_id], 0.7, {opacity: 0, scaleX:0, scaleY:0, ease: Power4.easeOut})

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

		let win = false
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

			this.setState({
				game_stat: (cell_vals[set[0]]=='x'?'You':'Opponent')+' win',
				game_play: false
			})

			this.socket && this.socket.disconnect();

		} else if (fin) {
		
			this.setState({
				game_stat: 'Draw',
				game_play: false
			})

			this.socket && this.socket.disconnect();

		} else {
			this.props.game_type!='live' && this.state.next_turn_ply && setTimeout(this.turn_comp.bind(this), rand_to_fro(500, 1000));

			this.setState({
				next_turn_ply: !this.state.next_turn_ply
			})
		}
		
	}

//	------------------------	------------------------	------------------------

	end_game () {
		this.socket && this.socket.disconnect();

		this.props.onEndGame()
	}



}
