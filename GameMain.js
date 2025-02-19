// ...existing code...

function turn_comp() {

	let { cell_vals } = this.state
	let empty_cells_arr = []

	for (let i=1; i<=16; i++) 
		!cell_vals['c'+i] && empty_cells_arr.push('c'+i)
	// console.log(cell_vals, empty_cells_arr, rand_arr_elem(empty_cells_arr))

	const c = rand_arr_elem(empty_cells_arr)
	cell_vals[c] = 'o'

	TweenMax.from(this.refs[c], 0.7, {opacity: 0, scaleX:0, scaleY:0, ease: Power4.easeOut})

	this.state.cell_vals = cell_vals

	this.check_turn()
}

function check_turn () {

	const { cell_vals } = this.state

	let win = false
	let set
	let fin = true

	if (this.props.game_type!='live')
		this.state.game_stat = 'Play'

	for (let i=0; !win && i<this.win_sets.length; i++) {
		set = this.win_sets[i]
		if (cell_vals[set[0]] && cell_vals[set[0]]==cell_vals[set[1]] && cell_vals[set[0]]==cell_vals[set[2]] && cell_vals[set[0]]==cell_vals[set[3]])
			win = true
	}

	for (let i=1; i<=16; i++) 
		!cell_vals['c'+i] && (fin = false)

	if (win) {
	
		this.refs[set[0]].classList.add('win')
		this.refs[set[1]].classList.add('win')
		this.refs[set[2]].classList.add('win')
		this.refs[set[3]].classList.add('win')

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

// ...existing code...
