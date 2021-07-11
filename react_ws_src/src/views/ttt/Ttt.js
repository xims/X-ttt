import React, { Component } from "react";
import { Link } from "react-router";
import SetName from "./SetName";
import SetGameType from "./SetGameType";
import GameMain from "./GameMain";
import { GAME_STEP, GAME_TYPES } from "./consts";

export default class Ttt extends Component {
  constructor(props) {
    super(props);

    this.set_game_step = this.set_game_step.bind(this);
    this.gameEnd = this.gameEnd.bind(this);
    this.saveGameType = this.saveGameType.bind(this);
    this.saveUserName = this.saveUserName.bind(this);

    const name = app.settings.curr_user && app.settings.curr_user.name;

    this.state = {
      name,
      game_type: GAME_TYPES.none,
    };
  }

  //	------------------------	------------------------	------------------------

  render() {
    const { name, game_step, game_type } = this.state;

    let step = GAME_STEP.playing;

    if (!name) {
      step = GAME_STEP.settingName
    } else if (game_type === GAME_TYPES.none) {
      step = GAME_STEP.settingGameType
    }


    return (
      <section id="TTT_game">
        <div id="page-container">
          {step === GAME_STEP.settingName && <SetName onSetName={this.saveUserName} />}

          {name && (
            <div>
              <h2>Welcome, {app.settings.curr_user.name}</h2>
            </div>
          )}

          {step === GAME_STEP.settingGameType && (
            <SetGameType onSetType={this.saveGameType} />
          )}

          {step === GAME_STEP.playing && (
            <GameMain
              game_type={game_type}
              onEndGame={this.gameEnd}
            />
          )}
        </div>
      </section>
    );
  }

  //	------------------------	------------------------	------------------------

  saveUserName(name) {
    app.settings.curr_user = { name };

    this.setState({ name });
  }

  //	------------------------	------------------------	------------------------

  saveGameType(game_type) {
    this.setState({ game_type });
  }

  //	------------------------	------------------------	------------------------

  gameEnd(t) {
    this.setState({ game_type: GAME_TYPES.none });
  }

  //	------------------------	------------------------	------------------------

  set_game_step() {
    let step = GAME_STEP.setStartGame

    if (!app.settings.curr_user || !app.settings.curr_user.name) {
      step = GAME_STEP.setname
    } else if (this.state.game_type === null) {
      step = GAME_STEP.setGameType
    }

    console.log('step:', step)

    return step;
  }
}
