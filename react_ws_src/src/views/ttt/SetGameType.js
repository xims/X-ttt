import React, {Component} from 'react'

const GRID_OPTIONS = [3, 4, 5]

function GridIcon ({ size, active }) {
		const cellPx = 8
		const gapPx = 2
		const cells = []
		for (let i = 0; i < size * size; i++) cells.push(i)
		return (
			<span className={'grid_icon' + (active ? ' active' : '')} style={{
				display: 'inline-grid',
				gridTemplateColumns: `repeat(${size}, ${cellPx}px)`,
				gridTemplateRows: `repeat(${size}, ${cellPx}px)`,
				gap: gapPx,
				width: size * cellPx + (size - 1) * gapPx,
				height: size * cellPx + (size - 1) * gapPx
			}}>
				{cells.map((i) => <span key={i} className="grid_cell" />)}
			</span>
		)
	}

export default class SetGameType extends Component {

	constructor (props) {
		super(props)

		this.state = {
			gridSize: 3
		}
	}

//	------------------------	------------------------	------------------------

	render () {
		const { gridSize } = this.state

		return (
			<div id='SetGameType'>

				<h1>Choose game type</h1>

				<div className="grid_size_picker">
					<label>Grid size</label>
					<div className="grid_options">
						{GRID_OPTIONS.map((size) => (
							<button
								key={size}
								type="button"
								className={'grid_option' + (gridSize === size ? ' active' : '')}
								onClick={() => this.setState({ gridSize: size })}
							>
								<GridIcon size={size} active={gridSize === size} />
								<span>{size}×{size}</span>
							</button>
						))}
					</div>
				</div>

				<button type='submit' onClick={this.selTypeLive.bind(this)} className='button long'><span>Live against another player <span className='fa fa-caret-right'></span></span></button>
				
				&nbsp;&nbsp;&nbsp;&nbsp;

				<button type='submit' onClick={this.selTypeComp.bind(this)} className='button long'><span>Against a computer <span className='fa fa-caret-right'></span></span></button>

			</div>
		)
	}

//	------------------------	------------------------	------------------------

	selTypeLive (e) {
		this.props.onSetType('live', this.state.gridSize)
	}

//	------------------------	------------------------	------------------------

	selTypeComp (e) {
		this.props.onSetType('comp', this.state.gridSize)
	}

}
