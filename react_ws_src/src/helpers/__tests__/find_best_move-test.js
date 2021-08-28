/** @format */

jest.unmock("../find_best_move.js")
import {
	getEmptyCells,
	move,
	easyLevelMove,
	hardLevelMove
} from "../find_best_move"

describe("getEmptyCell function", () => {
	it("should return the empty fields list", () => {
		const cells = { c1: "x", c5: "x" }
		expect(getEmptyCells(cells)).toEqual([
			"c2",
			"c3",
			"c4",
			"c6",
			"c7",
			"c8",
			"c9"
		])
	})

	it("should return empty array, when there is no empty field", () => {
		const cells = {
			c1: "x",
			c2: "x",
			c3: "x",
			c4: "x",
			c5: "x",
			c6: "x",
			c7: "x",
			c8: "x",
			c9: "x"
		}
		expect(getEmptyCells(cells)).toEqual([])
	})
})

// TODO: more unit will be here
