/** @format */

import React from "react"
import { Link } from "react-router"

import {
	FooterWrap,
	FooterLogo,
	FooterMessage,
	FooterNav
} from "./footer.styles"
import { Container } from "../../../global.styles"

const Footer = () => {
	return (
		<FooterWrap>
			<Container>
				<FooterNav>
					<ul>
						{app.settings.ws_conf.footer.items.i.map((it, i) => (
							<li key={i}>
								{it.tp == "ln" ? <Link to={it.u}>{it.txt}</Link> : it.txt}
							</li>
						))}
					</ul>
				</FooterNav>

				<FooterMessage>
					{app.settings.ws_conf.footer.foot_msg.txt}
				</FooterMessage>

				<FooterLogo
					href={app.settings.ws_conf.footer.foot_r_logo.u}
					target={app.settings.ws_conf.footer.foot_r_logo.t}
					rel='noopener noreferrer'
				>
					<img
						alt='footer logo'
						src={app.settings.ws_conf.footer.foot_r_logo.i}
					/>
				</FooterLogo>
			</Container>
		</FooterWrap>
	)
}

export default Footer
