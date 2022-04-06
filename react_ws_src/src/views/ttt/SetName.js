import React, { Component } from "react";

export default class SetName extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
      value: "",
    };

    this.handleChange = this.handleChange.bind(this);
  }
  //	------------------------	------------------------	------------------------

  render() {
    return (
      <div id="SetName">
        <h1>Set Name</h1>

        <div ref="nameHolder" className="input_holder left">
          <label>Name </label>
          <input
            onChange={this.handleChange}
            type="text"
            className="input name"
            placeholder="Name"
          />
          {this.state.hasError && (
            <span className="error">Please enter a name to start.</span>
          )}
        </div>

        <button
          type="submit"
          onClick={this.saveName.bind(this)}
          className="button"
        >
          <span>
            SAVE <span className="fa fa-caret-right"></span>
          </span>
        </button>
      </div>
    );
  }

  //	------------------------	------------------------	------------------------

  handleChange(event) {
    this.setState({ value: event.target.value.trim(), hasError: false });
  }

  saveName(e) {
    if (this.state.value === "") {
      this.setState((state) => {
        return { value: state.value, hasError: true };
      });
      return;
    }

    this.props.onSetName(this.state.value);
  }
}
