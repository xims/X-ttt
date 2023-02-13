import React from 'react'
import Button from '../../components/Button'

export default function SetGameType({ onSetType }) {
	function selTypeLive() {
		onSetType('live')
	}

	function selTypeComp() {
		onSetType('comp')
	}

	return (
		<div id="SetGameType">
			<h1>Choose game type</h1>
			<div className="space-x-3">
				<Button long onClick={selTypeLive}>
					Live against another player
				</Button>
				<Button long onClick={selTypeComp}>
					Against a computer
				</Button>
			</div>
		</div>
	)
}
