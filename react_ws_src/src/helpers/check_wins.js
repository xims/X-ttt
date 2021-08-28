/** @format */

export const WIN_SETS = [
	["c1", "c2", "c3"],
	["c4", "c5", "c6"],
	["c7", "c8", "c9"],

	["c1", "c4", "c7"],
	["c2", "c5", "c8"],
	["c3", "c6", "c9"],

	["c1", "c5", "c9"],
	["c3", "c5", "c7"]
]

const checkWin = (cell_vals) => {
	for (let i = 0; i < WIN_SETS.length; i++) {
		let set = WIN_SETS[i]
		if (
			cell_vals[set[0]] &&
			cell_vals[set[0]] == cell_vals[set[1]] &&
			cell_vals[set[0]] == cell_vals[set[2]]
		)
			return set
	}
}

export default checkWin