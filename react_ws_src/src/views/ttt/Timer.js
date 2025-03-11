import React, { Component } from "react";
import PropTypes from "prop-types";

export default class Timer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timeLeft: props.timeLimit,
      isRunning: false,
    };
  }

  componentDidMount() {
    this.startTimer();
  }

  componentWillUnmount() {
    this.stopTimer();
  }

  startTimer = () => {
    if (!this.state.isRunning) {
      this.setState({ isRunning: true });
      this.timer = setInterval(() => {
        const timeLeft = this.state.timeLeft - 1;
        if (timeLeft === 0) {
          this.stopTimer();
          this.props.onTimeUp();
        } else {
          this.setState({ timeLeft });
        }
      }, 1000);
    }
  };

  stopTimer = () => {
    if (this.timer) {
      clearInterval(this.timer);
      this.setState({ isRunning: false });
    }
  };

  formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  render() {
    const { timeLeft } = this.state;
    return (
      <div className="game-timer">
        <div className={`timer ${timeLeft <= 10 ? "timer-warning" : ""}`}>
          Time left: {this.formatTime(timeLeft)}
        </div>
      </div>
    );
  }
}

Timer.propTypes = {
  timeLimit: PropTypes.number.isRequired,
  onTimeUp: PropTypes.func.isRequired,
};
