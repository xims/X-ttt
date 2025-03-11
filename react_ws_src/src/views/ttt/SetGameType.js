import React, { Component } from "react";
import PropTypes from "prop-types";

export default class SetGameType extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedTimeLimit: 60, // Default 60 seconds
    };
  }

  //	------------------------	------------------------	------------------------

  render() {
    const { selectedTimeLimit } = this.state;

    return (
      <div id="SetGameType">
        <h1>Choose game type</h1>

        <div
          className="input_holder select_option"
          style={{ margin: "0 auto", marginBottom: "20px" }}
        >
          <label>Time Limit per Player</label>
          <select
            value={selectedTimeLimit}
            onChange={(e) =>
              this.setState({ selectedTimeLimit: parseInt(e.target.value) })
            }
          >
            <option value={30}>30 seconds</option>
            <option value={60}>1 minute</option>
            <option value={120}>2 minutes</option>
            <option value={300}>5 minutes</option>
            <option value={600}>10 minutes</option>
          </select>
        </div>

        <button
          type="submit"
          onClick={this.selTypeLive.bind(this)}
          className="button long"
        >
          <span>
            Live against another player{" "}
            <span className="fa fa-caret-right"></span>
          </span>
        </button>

        <button
          type="submit"
          onClick={this.selTypeComp.bind(this)}
          className="button long"
          style={{ marginLeft: "20px" }}
        >
          <span>
            Against a Super computer <span className="fa fa-caret-right"></span>
          </span>
        </button>
      </div>
    );
  }

  //	------------------------	------------------------	------------------------

  selTypeLive(e) {
    const { selectedTimeLimit } = this.state;
    this.props.onSetType({ type: "live", timeLimit: selectedTimeLimit });
  }

  //	------------------------	------------------------	------------------------

  selTypeComp(e) {
    const { selectedTimeLimit } = this.state;
    this.props.onSetType({ type: "comp", timeLimit: selectedTimeLimit });
  }
}

SetGameType.propTypes = {
  onSetType: PropTypes.func.isRequired,
};
