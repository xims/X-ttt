/** @format */

import React, { Component } from "react"
import PropTypes from "prop-types"
import { Link } from "react-router"

import X2JS from "x2js"

export default class Txt_page extends Component {
	constructor(props) {
		super(props)

		this.state = {}
	}

	//	------------------------	------------------------	------------------------

	render() {
		// const { page } = this.props.params
		const page = this.props.params.page || "home"
		const page_x = app.settings.ws_conf.pgs[page]

		// console.log('Txt_page', page)

		if (!page || !page_x) return null

		return (
			<section id='Txt_page'>
				<div id='page-container'>
					<h1>{page_x.pg_name}</h1>

					{/* dangerouslySetInnerHTML is very easy to cause cross-site script (XSS) especially rendering html from untrusted source  */}
					<div dangerouslySetInnerHTML={{ __html: page_x.txt.__cdata }} />

					<div className='btns'>
						{new X2JS().asArray(page_x.btns.b).map(function (b, i) {
							console.log(b)
							return (
								<Link to={b.u} key={i}>
									<button type='submit' className='button'>
										<span>
											{b.txt} <span className='fa fa-caret-right'></span>
										</span>
									</button>
								</Link>
							)
						})}
					</div>
				</div>
			</section>
		)
	}
}

Txt_page.propTypes = {
	params: PropTypes.any
}

Txt_page.contextTypes = {
	router: PropTypes.object.isRequired
}
