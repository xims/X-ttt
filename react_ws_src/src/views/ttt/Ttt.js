import React, { Component } from "react";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

import SetName from "./SetName";
import SetGameType from "./SetGameType";
import GameMain from "./GameMain";

// Create a wrapper component that uses hooks
function TttWithNavigation(props) {
  const navigate = useNavigate();

  // This function handles navigation to the homepage
  const handleEndGame = () => {
    navigate("/");
  };

  return <TttClass {...props} navigateToHome={handleEndGame} />;
}

// Rename the class component
class TttClass extends Component {
  constructor(props) {
    super(props);

    this.state = {
      game_step: this.set_game_step(),
      game_type: null,
    };
  }

  render() {
    const { game_step, game_type } = this.state;

    return (
      <section id="TTT_game">
        <div id="page-container">
          {game_step === "set_name" && (
            <SetName onSetName={this.saveUserName.bind(this)} />
          )}

          {game_step !== "set_name" && (
            <div>
              <h2>Welcome, {window.app.settings.curr_user.name}</h2>
            </div>
          )}

          {game_step === "set_game_type" && (
            <SetGameType onSetType={this.saveGameType.bind(this)} />
          )}

          {game_step === "start_game" && (
            <GameMain
              game_type={game_type}
              onEndGame={this.gameEnd.bind(this)}
            />
          )}
        </div>
      </section>
    );
  }

  saveUserName(n) {
    window.app.settings.curr_user = {};
    window.app.settings.curr_user.name = n;
    this.upd_game_step();
  }

  saveGameType(gameConfig) {
    this.setState(
      {
        game_type: gameConfig,
      },
      this.upd_game_step
    );
  }

  gameEnd() {
    // Navigate to home when game ends
    this.props.navigateToHome();

    this.setState(
      {
        game_type: null,
      },
      this.upd_game_step
    );
  }

  upd_game_step() {
    this.setState({
      game_step: this.set_game_step(),
    });
  }

  set_game_step() {
    if (!window.app || !window.app.settings) return "set_name";
    if (!window.app.settings.curr_user || !window.app.settings.curr_user.name)
      return "set_name";
    else if (!this.state.game_type) return "set_game_type";
    else return "start_game";
  }
}

TttClass.propTypes = {
  params: PropTypes.any,
  navigateToHome: PropTypes.func.isRequired,
};

// Export the wrapper component instead
export default TttWithNavigation;
