/** @format */

import styled from "styled-components"
import COLOURS from "../../../global.styles"

export const FooterWrap = styled.footer`
	width: 100%;
	height: 50px;
	position: fixed;
	z-index: 20;
	bottom: 0;
	left: 0;
	background: ${COLOURS.lightGrey};
	display: block;
`

export const FooterMessage = styled.div`
	position: absolute;
	margin: 15px 110px auto 490px;
	font-size: 0.75em;
	color: ${COLOURS.grey};
	text-align: center;
`
export const FooterNav = styled.nav`
	position: absolute;
	left: 30px;
	height: 100%;

	ul {
		list-style-type: none;
		margin: 0;
		padding: 0;

		li {
			display: inline;
			height: 100%;
			line-height: 50px;
			text-transform: uppercase;
			font-size: 0.65em;
			margin-right: 10px;
			color: ${COLOURS.grey};

			a {
				color: ${COLOURS.grey};
				text-decoration: none;
			}
			a:hover {
				color: ${COLOURS.dark};
			}
		}
	}
`
export const FooterLogo = styled.a`
	position: absolute;
	right: 30px;
	top: 0;
	height: 50px;
	width: 60px;

	img {
		margin: auto;
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		width: 100%;
	}
`
