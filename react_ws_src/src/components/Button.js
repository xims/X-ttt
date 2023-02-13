import React from 'react'

export default function Button({ children, long, uppercase, onClick }) {
	return (
		<button
			className={`button ${long ? 'long' : ''} ${uppercase ? 'uppercase' : ''}`}
			type="submit"
			onClick={onClick}
		>
			{children} <span className="fa fa-caret-right"></span>
		</button>
	)
}

Button.propTypes = {
	children: React.PropTypes.any,
	long: React.PropTypes.bool,
	uppercase: React.PropTypes.bool,
	onClick: React.PropTypes.func,
}
