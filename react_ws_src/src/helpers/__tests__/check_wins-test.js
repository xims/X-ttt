/** @format */

jest.unmock("../check_wins")
import checkWin, { WIN_SETS } from "../check_wins"

describe("checkWin function", () => {
	it("should return the matched win set against given cell_values", () => {
		const winInstances = [
			{ c1: "x", c2: "x", c3: "x" },
			{ c4: "x", c5: "x", c6: "x" },
			{ c7: "x", c8: "x", c9: "x" },
			{ c1: "x", c4: "x", c7: "x" },
			{ c2: "x", c5: "x", c8: "x" },
			{ c3: "x", c6: "x", c9: "x" },
			{ c1: "x", c5: "x", c9: "x" },
			{ c3: "x", c5: "x", c7: "x" }
		]

		winInstances.forEach((winInstance, index) => {
			expect(checkWin(winInstance)).toEqual(WIN_SETS[index])
		})
	})
})
