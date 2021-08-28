/** @format */

import rand_arr_elem from "./rand_arr_elem"
import checkWin from "./check_wins"

let stepCounter = 0

export const LEVEL = {
	easy: "easy",
	medium: "medium",
	hard: "hard"
}

export const SCORES = {
	player: -1,
	AI: 1,
	tie: 0
}

export const getEmptyCells = (cells) => {
	const empty_cells_arr = []
	for (let i = 1; i <= 9; i++) !cells["c" + i] && empty_cells_arr.push("c" + i)
	return empty_cells_arr
}

export const move = (cells, depth, isAI) => {
	const winSet = checkWin(cells)

	if (winSet) {
		const winner = cells[winSet[0]] === "x" ? "player" : "AI"
		return SCORES[winner]
	} else {
		let fin = true
		for (let i = 1; i <= 9; i++) !cells["c" + i] && (fin = false)
		if (fin) return SCORES.tie
	}

	const emptyCells = getEmptyCells(cells)

	if (isAI) {
		let bestScore = -Infinity

		for (let i = 0; i < emptyCells.length; i++) {
			cells[emptyCells[i]] = "o"
			const sore = move(cells, depth + 1, false)
			cells[emptyCells[i]] = ""
			bestScore = Math.max(sore, bestScore)
		}
		return bestScore
	} else {
		let bestScore = Infinity

		for (let i = 0; i < emptyCells.length; i++) {
			cells[emptyCells[i]] = "x"
			const sore = move(cells, depth + 1, true)
			cells[emptyCells[i]] = ""
			bestScore = Math.min(sore, bestScore)
		}
		return bestScore
	}
}

export const easyLevelMove = (cells) => {
	const empty_cells_arr = getEmptyCells(cells)
	return rand_arr_elem(empty_cells_arr)
}

export const hardLevelMove = (cells) => {
	const empty_cells_arr = getEmptyCells(cells)
	let bestScore = -Infinity
	let moveTo = ""

	for (let i = 0; i < empty_cells_arr.length; i++) {
		cells[empty_cells_arr[i]] = "o"
		const score = move(cells, 0, false)
		cells[empty_cells_arr[i]] = ""

		if (score > bestScore) {
			bestScore = score
			moveTo = empty_cells_arr[i]
		}
	}

	return moveTo
}

const nextMove = (cells, level) => {
	switch (level) {
		case LEVEL.easy:
			return easyLevelMove(cells)
		case LEVEL.medium:
			stepCounter += 1
			if (stepCounter % 3) return hardLevelMove(cells)
			return easyLevelMove(cells)
		case LEVEL.hard:
			return hardLevelMove(cells)
		default:
			return easyLevelMove(cells)
	}
}

export default nextMove
