import React, { Component } from 'react'

export default class Timer extends Component {

	constructor(props) {
		super(props)
		
		this.state = {
			timeLeft: this.props.duration || 30,
			isActive: false
		}
		
		this.timer = null
	}

	componentDidMount() {
		if (this.props.autoStart) {
			this.startTimer()
		}
	}

	componentWillUnmount() {
		this.clearTimer()
	}

	componentDidUpdate(prevProps) {
		if (prevProps.gameType !== this.props.gameType) {
			this.resetTimer()
		}
		
		if (this.props.isPlayerTurn && !this.state.isActive) {
			this.startTimer()
		}
		
		if (!this.props.isPlayerTurn && this.state.isActive) {
			this.stopTimer()
		}
	}

	startTimer() {
		if (this.timer) return
		
		this.setState({ isActive: true })
		
		var self = this
		this.timer = setInterval(function() {
			self.setState(function(prevState) {
				const newTime = prevState.timeLeft - 1
				
				if (newTime <= 0) {
					self.clearTimer()
					self.props.onTimeUp && self.props.onTimeUp()
					return { timeLeft: 0, isActive: false }
				}
				
				return { timeLeft: newTime }
			})
		}, 1000)
	}

	stopTimer() {
		this.clearTimer()
		this.setState({ isActive: false })
	}

	resetTimer() {
		this.clearTimer()
		this.setState({ 
			timeLeft: this.props.duration || 30,
			isActive: false 
		})
	}

	clearTimer() {
		if (this.timer) {
			clearInterval(this.timer)
			this.timer = null
		}
	}

	render() {
		const { timeLeft, isActive } = this.state
		const { duration = 30 } = this.props
		
		const percentage = (timeLeft / duration) * 100
		
		let timerClass = 'timer'
		if (timeLeft <= 5) {
			timerClass += ' timer-critical'
		} else if (timeLeft <= 10) {
			timerClass += ' timer-warning'
		}
		
		if (isActive) {
			timerClass += ' timer-active'
		}

		return (
			<div className={timerClass}>
				<div className="timer-display">
					<span className="timer-text">{timeLeft}s</span>
				</div>
				<div className="timer-bar">
					<div 
						className="timer-progress" 
						style={{ width: `${percentage}%` }}
					></div>
				</div>
			</div>
		)
	}
}
