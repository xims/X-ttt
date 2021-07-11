import React, { Component } from "react";
import io from "socket.io-client";
import TweenMax from "gsap";
import rand_arr_elem from "../../helpers/rand_arr_elem";
import rand_to_fro from "../../helpers/rand_to_fro";
import { GAME_TYPES } from "./consts";

export default class SetName extends Component {
  constructor(props) {
    super(props);

    this.win_sets = [
      ["c1", "c2", "c3"],
      ["c4", "c5", "c6"],
      ["c7", "c8", "c9"],

      ["c1", "c4", "c7"],
      ["c2", "c5", "c8"],
      ["c3", "c6", "c9"],

      ["c1", "c5", "c9"],
      ["c3", "c5", "c7"]
    ];

    this.clear_win = this.clear_win.bind(this);

    if (this.props.game_type !== GAME_TYPES.live)
      this.state = {
        cell_vals: {},
        next_turn_ply: true,
        game_play: true,
        game_stat: "Start game"
      };
    else {
      this.sock_start();

      this.state = {
        cell_vals: {},
        next_turn_ply: true,
        game_play: false,
        game_stat: "Connecting"
      };
    }
  }

  //	------------------------	------------------------	------------------------

  componentDidMount() {
    TweenMax.from("#game_stat", 1, {
      display: "none",
      opacity: 0,
      scaleX: 0,
      scaleY: 0,
      ease: Power4.easeIn
    });

    TweenMax.from("#game_board", 1, {
      display: "none",
      opacity: 0,
      x: -200,
      y: -200,
      scaleX: 0,
      scaleY: 0,
      ease: Power4.easeIn
    });
  }

  //	------------------------	------------------------	------------------------
  //	------------------------	------------------------	------------------------

  sock_start() {

    this.socket = io(app.settings.ws_conf.loc.SOCKET__io.u);

    this.socket.on(
      "connect",
      function (data) {
        // console.log('socket connected', data)

        this.socket.emit("new player", { name: app.settings.curr_user.name });
      }.bind(this)
    );

    this.socket.on(
      "pair_players",
      function (data) {
        // console.log('paired with ', data)

        this.setState({
          next_turn_ply: data.mode === "m",
          game_play: true,
          game_stat: "Playing with " + data.opp.name
        });
      }.bind(this)
    );

    this.socket.on("opp_turn", this.turn_opp_live.bind(this));

    this.socket.on("restart_game", this.start_new_game.bind(this));

    this.socket.on("opp_disconnect", this.opp_disconnect.bind(this));
  }

  //	------------------------	------------------------	------------------------
  //	------------------------	------------------------	------------------------

  componentWillUnmount() {
    this.socket && this.socket.disconnect();
  }

  //	------------------------	------------------------	------------------------

  cell_cont(c) {
    const { cell_vals } = this.state;

    return (
      <div>
        {cell_vals && cell_vals[c] === "x" && (
          <i className="fa fa-times fa-5x"></i>
        )}
        {cell_vals && cell_vals[c] === "o" && (
          <i className="fa fa-circle-o fa-5x"></i>
        )}
      </div>
    );
  }

  //	------------------------	------------------------	------------------------

  render() {
    const { cell_vals, game_play } = this.state;
    const { game_type } = this.props;

    const gameTypeText = game_type === GAME_TYPES.live ? 'online' : 'againt computer';

    return (
      <div id="GameMain">
        <h1>Playing {gameTypeText}</h1>
        <div id="game_stat">
          <div id="game_stat_msg">{this.state.game_stat}</div>
          {this.state.game_play && (
            <div id="game_turn_msg">
              {this.state.next_turn_ply ? "Your turn" : "Opponent turn"}
            </div>
          )}
        </div>


        <div id="game_board">
        {
            new Array(9).fill(0).map((_, idx) => (
              <div className="cell_container" key={idx}>
                <div className="cell"                   
                  id={`game_board-c${idx+1}`}
                  ref={`c${idx+1}`}
                  onClick={this.click_cell.bind(this)}>
                  {this.cell_cont(`c${idx+1}`)}
                </div>
              </div>
            ))
        }
        </div>

        {/* <div id="game_board">
          <table>
            <tbody>
              <tr>
                <td
                  id="game_board-c1"
                  ref="c1"
                  onClick={this.click_cell.bind(this)}
                >
                  {this.cell_cont("c1")}
                </td>
                <td
                  id="game_board-c2"
                  ref="c2"
                  onClick={this.click_cell.bind(this)}
                  className="vbrd"
                >
                  {this.cell_cont("c2")}
                </td>
                <td
                  id="game_board-c3"
                  ref="c3"
                  onClick={this.click_cell.bind(this)}
                >
                  {this.cell_cont("c3")}
                </td>
              </tr>
              <tr>
                <td
                  id="game_board-c4"
                  ref="c4"
                  onClick={this.click_cell.bind(this)}
                  className="hbrd"
                >
                  {this.cell_cont("c4")}
                </td>
                <td
                  id="game_board-c5"
                  ref="c5"
                  onClick={this.click_cell.bind(this)}
                  className="vbrd hbrd"
                >
                  {this.cell_cont("c5")}
                </td>
                <td
                  id="game_board-c6"
                  ref="c6"
                  onClick={this.click_cell.bind(this)}
                  className="hbrd"
                >
                  {this.cell_cont("c6")}
                </td>
              </tr>
              <tr>
                <td
                  id="game_board-c7"
                  ref="c7"
                  onClick={this.click_cell.bind(this)}
                >
                  {this.cell_cont("c7")}
                </td>
                <td
                  id="game_board-c8"
                  ref="c8"
                  onClick={this.click_cell.bind(this)}
                  className="vbrd"
                >
                  {this.cell_cont("c8")}
                </td>
                <td
                  id="game_board-c9"
                  ref="c9"
                  onClick={this.click_cell.bind(this)}
                >
                  {this.cell_cont("c9")}
                </td>
              </tr>
            </tbody>
          </table>
        </div> */}

        <button
          type="button-secondary"
          onClick={this.restart_game.bind(this)}
          className="button"          
          disabled={game_play}  
        >
          <span>
            Restart Game <span className="fa fa-refresh"></span>
          </span>
        </button>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <button
          type="submit"
          onClick={this.end_game.bind(this)}
          className="button"
        >
          <span>
            End Game <span className="fa fa-caret-right"></span>
          </span>
        </button>
      </div>
    );
  }

  //	------------------------	------------------------	------------------------
  //	------------------------	------------------------	------------------------

  click_cell(e) {
    // console.log(e.currentTarget.id.substr(11))
    // console.log(e.currentTarget)

    if (!this.state.next_turn_ply || !this.state.game_play) {
      return;
    }

    const cell_id = e.currentTarget.id.substr(11);

    if (this.state.cell_vals[cell_id]) {
      return;
    }

    if (this.props.game_type !== GAME_TYPES.live) {
      this.turn_ply_comp(cell_id);
    } else {
      this.turn_ply_live(cell_id);
    }
  }

  //	------------------------	------------------------	------------------------
  //	------------------------	------------------------	------------------------

  turn_ply_comp(cell_id) {
    let { cell_vals } = this.state;

    cell_vals[cell_id] = "x";

    TweenMax.from(this.refs[cell_id], 0.7, {
      opacity: 0,
      scaleX: 0,
      scaleY: 0,
      ease: Power4.easeOut
    });

    // this.setState({
    // 	cell_vals: cell_vals,
    // 	next_turn_ply: false
    // })

    // setTimeout(this.turn_comp.bind(this), rand_to_fro(500, 1000));

    this.state.cell_vals = cell_vals;

    this.check_turn();
  }

  //	------------------------	------------------------	------------------------

  turn_comp() {
    let { cell_vals } = this.state;
    let empty_cells_arr = [];

    for (let i = 1; i <= 9; i++)
      !cell_vals["c" + i] && empty_cells_arr.push("c" + i);
    // console.log(cell_vals, empty_cells_arr, rand_arr_elem(empty_cells_arr))

    const c = rand_arr_elem(empty_cells_arr);
    cell_vals[c] = "o";

    TweenMax.from(this.refs[c], 0.7, {
      opacity: 0,
      scaleX: 0,
      scaleY: 0,
      ease: Power4.easeOut
    });

    // this.setState({
    // 	cell_vals: cell_vals,
    // 	next_turn_ply: true
    // })

    this.state.cell_vals = cell_vals;

    this.check_turn();
  }

  //	------------------------	------------------------	------------------------
  //	------------------------	------------------------	------------------------

  turn_ply_live(cell_id) {
    let { cell_vals } = this.state;

    cell_vals[cell_id] = "x";

    TweenMax.from(this.refs[cell_id], 0.7, {
      opacity: 0,
      scaleX: 0,
      scaleY: 0,
      ease: Power4.easeOut
    });

    this.socket.emit("ply_turn", { cell_id });

    // this.setState({
    // 	cell_vals: cell_vals,
    // 	next_turn_ply: false
    // })

    // setTimeout(this.turn_comp.bind(this), rand_to_fro(500, 1000));

    this.state.cell_vals = cell_vals;

    this.check_turn();
  }

  //	------------------------	------------------------	------------------------

  turn_opp_live(data) {
    let { cell_vals } = this.state;
    let empty_cells_arr = [];

    const c = data.cell_id;
    cell_vals[c] = "o";

    TweenMax.from(this.refs[c], 0.7, {
      opacity: 0,
      scaleX: 0,
      scaleY: 0,
      ease: Power4.easeOut
    });

    // this.setState({
    // 	cell_vals: cell_vals,
    // 	next_turn_ply: true
    // })

    this.state.cell_vals = cell_vals;

    this.check_turn();
  }

  

  //	------------------------	------------------------	------------------------

  opp_disconnect(data) {
    // TODO: display a message saying the opponent disconnected

    this.setState({
      cell_vals: {},
      next_turn_ply: true,
      game_play: false,
      game_stat: "Opponent disconnected... Looking for a match."
    });
  }


  //	------------------------	------------------------	------------------------

  start_new_game(data) {
    this.clear_win();

    this.setState({
      cell_vals: {},
      next_turn_ply: false,
      game_play: true,
      game_stat: 'Game restarted',
    });
  }

  //	------------------------	------------------------	------------------------
  
  restart_game() {
    if (this.props.game_type === GAME_TYPES.live) {
      this.socket.emit("restart");
    }

    this.clear_win();

    this.setState({
      cell_vals: {},
      next_turn_ply: true,
      game_play: true,
      game_stat: 'Restarted',
    });  
  }

  clear_win() {
    for (let i = 1; i <= 9; i++) {
      this.refs[`c${i}`].classList.remove("win");
      this.refs[`c${i}`].classList.remove("lose");
    }
  }


  //	------------------------	------------------------	------------------------

  check_turn() {
    const { cell_vals } = this.state;

    let win = false;
    let set;
    let fin = true;

    if (this.props.game_type !== GAME_TYPES.live) this.state.game_stat = "Play";

    for (let i = 0; !win && i < this.win_sets.length; i++) {
      set = this.win_sets[i];
      if (
        cell_vals[set[0]] &&
        cell_vals[set[0]] === cell_vals[set[1]] &&
        cell_vals[set[0]] === cell_vals[set[2]]
      )
        win = true;
    }

    for (let i = 1; i <= 9; i++) !cell_vals["c" + i] && (fin = false);

    // win && console.log('win set: ', set)

    if (win) {
      const playerWon = cell_vals[set[0]] === "x"
      const winClass = playerWon ? 'win' : 'lose';

      this.refs[set[0]].classList.add(winClass);
      this.refs[set[1]].classList.add(winClass);
      this.refs[set[2]].classList.add(winClass);


      TweenMax.killAll(true);
      TweenMax.from("." + winClass, 1, { opacity: 0, ease: Linear.easeIn });

      this.setState({
        game_stat: "You " + (playerWon ? "WON" : "LOST") + "!!!!",
        game_play: false
      });

      // commented out to support restart
      // this.socket && this.socket.disconnect();
    } else if (fin) {
      this.setState({
        game_stat: "Game ended in a DRAW!!!",
        game_play: false
      });

      // commented out to support restart
      // this.socket && this.socket.disconnect();
    } else {
      this.props.game_type !== GAME_TYPES.live &&
        this.state.next_turn_ply &&
        setTimeout(this.turn_comp.bind(this), rand_to_fro(500, 1000));

      this.setState({
        next_turn_ply: !this.state.next_turn_ply
      });
    }
  }

  //	------------------------	------------------------	------------------------

  end_game() {
    this.socket && this.socket.disconnect();

    this.props.onEndGame();
  }
}
