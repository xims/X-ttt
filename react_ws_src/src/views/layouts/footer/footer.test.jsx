/** @format */

import { render } from "@testing-library/react"
import Footer from "./index"

describe("Footer component", () => {
	it("should match <Footer /> snapshot", () => {
		const { asFragment } = render(<Footer />)
		expect(asFragment()).toMatchSnapshot()
	})
})
