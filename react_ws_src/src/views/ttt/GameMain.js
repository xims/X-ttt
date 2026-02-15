import React, { Component } from 'react';

import io from 'socket.io-client';

import TweenMax from 'gsap';

import rand_arr_elem from '../../helpers/rand_arr_elem';
import rand_to_fro from '../../helpers/rand_to_fro';
import { AVATAR_OPTS } from './avatarOptions';

function buildWinSets(n) {
  const sets = [];
  const winLen = n >= 4 ? 4 : n; // connect 4 for 4x4 and 5x5; full line for 3x3

  function cellId(r, c) {
    return 'c' + (r * n + c + 1);
  }

  // rows: every contiguous winLen in each row
  for (let r = 0; r < n; r++) {
    for (let start = 0; start <= n - winLen; start++) {
      const row = [];
      for (let k = 0; k < winLen; k++) row.push(cellId(r, start + k));
      sets.push(row);
    }
  }
  // cols: every contiguous winLen in each column
  for (let c = 0; c < n; c++) {
    for (let start = 0; start <= n - winLen; start++) {
      const col = [];
      for (let k = 0; k < winLen; k++) col.push(cellId(start + k, c));
      sets.push(col);
    }
  }
  // main diagonals (top-left to bottom-right)
  for (let r = 0; r <= n - winLen; r++) {
    for (let c = 0; c <= n - winLen; c++) {
      const diag = [];
      for (let k = 0; k < winLen; k++) diag.push(cellId(r + k, c + k));
      sets.push(diag);
    }
  }
  // anti-diagonals (top-right to bottom-left)
  for (let r = 0; r <= n - winLen; r++) {
    for (let c = winLen - 1; c < n; c++) {
      const diag = [];
      for (let k = 0; k < winLen; k++) diag.push(cellId(r + k, c - k));
      sets.push(diag);
    }
  }
  return sets;
}

export default class SetName extends Component {
  constructor(props) {
    super(props);

    const gridSize = props.grid_size || 3;
    this.win_sets = buildWinSets(gridSize);
    this.gridSize = gridSize;
    this.totalCells = gridSize * gridSize;
    this.winLength = gridSize >= 4 ? 4 : 3;

    if (this.props.game_type != 'live')
      this.state = {
        cell_vals: {},
        next_turn_ply: true,
        game_play: true,
        game_stat: 'Start game',
        opp_avatar: this.get_comp_avatar(),
        game_result: null,
      };
    else {
      this.sock_start();

      this.state = {
        cell_vals: {},
        next_turn_ply: true,
        game_play: false,
        game_stat: 'Connecting',
        game_result: null,
      };
    }
  }

  //	------------------------	------------------------	------------------------

  componentDidMount() {
    TweenMax.from('#game_stat', 1, {
      display: 'none',
      opacity: 0,
      scaleX: 0,
      scaleY: 0,
      ease: Power4.easeIn,
    });
    TweenMax.from('#game_board', 1, {
      display: 'none',
      opacity: 0,
      x: -200,
      y: -200,
      scaleX: 0,
      scaleY: 0,
      ease: Power4.easeIn,
    });
  }

  //	------------------------	------------------------	------------------------
  //	------------------------	------------------------	------------------------

  sock_start() {
    this.socket = io(app.settings.ws_conf.loc.SOCKET__io.u);

    this.socket.on(
      'connect',
      function (data) {
        // console.log('socket connected', data)

        this.socket.emit('new player', {
          name: app.settings.curr_user.name,
          avatar: app.settings.curr_user.avatar,
        });
      }.bind(this),
    );

    this.socket.on(
      'pair_players',
      function (data) {
        // console.log('paired with ', data)

        this.setState({
          next_turn_ply: data.mode == 'm',
          game_play: true,
          game_stat: 'Playing with ' + data.opp.name,
          opp_avatar: data.opp.avatar,
        });
      }.bind(this),
    );

    this.socket.on('opp_turn', this.turn_opp_live.bind(this));
  }

  //	------------------------	------------------------	------------------------
  //	------------------------	------------------------	------------------------

  componentWillUnmount() {
    this.socket && this.socket.disconnect();
    if (this._gameResultTimeout) {
      clearTimeout(this._gameResultTimeout);
      this._gameResultTimeout = null;
    }
  }

  //	------------------------	------------------------	------------------------

  get_comp_avatar() {
    const ply_avatar = app.settings.curr_user && app.settings.curr_user.avatar;

    if (ply_avatar == '❌') return '⭕';
    if (ply_avatar == '⭕') return '❌';

    const comp_opts = AVATAR_OPTS.filter(function (a) {
      return a != ply_avatar;
    });

    return rand_arr_elem(comp_opts.length ? comp_opts : AVATAR_OPTS);
  }

  //	------------------------	------------------------	------------------------

  cell_cont(c) {
    const { cell_vals } = this.state;
    const user_avatar =
      app.settings.curr_user && app.settings.curr_user.avatar
        ? app.settings.curr_user.avatar
        : '❌';
    const opp_avatar = this.state.opp_avatar || '⭕';
    const size = this.gridSize === 3 ? 64 : this.gridSize === 4 ? 48 : 38;

    return (
      <div>
        {cell_vals && cell_vals[c] == 'x' && (
          <span style={{ fontSize: size + 'px', lineHeight: 1 }}>
            {user_avatar}
          </span>
        )}
        {cell_vals && cell_vals[c] == 'o' && (
          <span style={{ fontSize: size + 'px', lineHeight: 1 }}>
            {opp_avatar}
          </span>
        )}
      </div>
    );
  }

  //	------------------------	------------------------	------------------------

  render() {
    const { cell_vals } = this.state;
    // console.log(cell_vals)

    const instructionText =
      this.winLength === 4
        ? 'Connect 4 in a row to win!'
        : 'Get 3 in a row to win!';

    return (
      <div id="GameMain">
        <h1>Play {this.props.game_type}</h1>
        <div id="game_board_container">
          <div id="game_stat">
            <div id="game_stat_msg">{this.state.game_stat}</div>
            {this.state.game_play && (
              <div id="game_turn_msg">
                {this.state.next_turn_ply ? 'Your turn' : 'Opponent turn'}
              </div>
            )}
          </div>
          <div id="game_board" className={'grid-' + this.gridSize}>
            <table>
              <tbody>
                {Array.from({ length: this.gridSize }, (_, r) => (
                  <tr key={r}>
                    {Array.from({ length: this.gridSize }, (_, c) => {
                      const cellId = 'c' + (r * this.gridSize + c + 1);
                      const cls =
                        (c < this.gridSize - 1 ? ' vbrd' : '') +
                        (r < this.gridSize - 1 ? ' hbrd' : '');
                      return (
                        <td
                          key={cellId}
                          id={'game_board-' + cellId}
                          ref={cellId}
                          onClick={this.click_cell.bind(this)}
                          className={cls.trim()}
                        >
                          {this.cell_cont(cellId)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="game_instruction">{instructionText}</p>
        </div>

        <div className="game_page_actions">
          {!this.state.game_play &&
            !(this.props.game_type === 'live' && this.state.game_stat === 'Connecting') && (
            <button
              type="button"
              onClick={this.retry_game.bind(this)}
              className="button"
            >
              <span>
                Retry <span className="fa fa-caret-right"></span>
              </span>
            </button>
          )}
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

        {this.state.game_result && (
          <div className="game_overlay" onClick={(e) => e.target.className === 'game_overlay' && this.setState({ game_result: null })}>
            <div className="game_result_modal">
              <p className="game_result_message">
                {this.state.game_result === 'win' && 'Congratulations! You win!'}
                {this.state.game_result === 'lose' && 'Sorry, you didn\'t win this time.'}
                {this.state.game_result === 'draw' && 'It\'s a draw. Good game!'}
              </p>
              <div className="game_result_actions">
                <button type="button" className="button" onClick={this.retry_game.bind(this)}>
                  <span>Retry <span className="fa fa-caret-right"></span></span>
                </button>
                <button type="button" className="button" onClick={this.end_game.bind(this)}>
                  <span>End Game <span className="fa fa-caret-right"></span></span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  retry_game() {
    for (let i = 1; i <= this.totalCells; i++) {
      const ref = this.refs['c' + i];
      if (ref && ref.classList) ref.classList.remove('win');
    }
    const newState = {
      cell_vals: {},
      next_turn_ply: true,
      game_play: true,
      game_stat: 'Start game',
      game_result: null,
    };
    if (this.props.game_type != 'live') {
      newState.opp_avatar = this.get_comp_avatar();
    }
    this.setState(newState);
  }

  //	------------------------	------------------------	------------------------
  //	------------------------	------------------------	------------------------

  click_cell(e) {
    // console.log(e.currentTarget.id.substr(11))
    // console.log(e.currentTarget)

    if (!this.state.next_turn_ply || !this.state.game_play) return;

    const cell_id = e.currentTarget.id.substr(11);
    if (this.state.cell_vals[cell_id]) return;

    if (this.props.game_type != 'live') this.turn_ply_comp(cell_id);
    else this.turn_ply_live(cell_id);
  }

  //	------------------------	------------------------	------------------------
  //	------------------------	------------------------	------------------------

  turn_ply_comp(cell_id) {
    let { cell_vals } = this.state;

    cell_vals[cell_id] = 'x';

    TweenMax.from(this.refs[cell_id], 0.7, {
      opacity: 0,
      scaleX: 0,
      scaleY: 0,
      ease: Power4.easeOut,
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

    for (let i = 1; i <= this.totalCells; i++)
      !cell_vals['c' + i] && empty_cells_arr.push('c' + i);
    // console.log(cell_vals, empty_cells_arr, rand_arr_elem(empty_cells_arr))

    const c = rand_arr_elem(empty_cells_arr);
    cell_vals[c] = 'o';

    TweenMax.from(this.refs[c], 0.7, {
      opacity: 0,
      scaleX: 0,
      scaleY: 0,
      ease: Power4.easeOut,
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

    cell_vals[cell_id] = 'x';

    TweenMax.from(this.refs[cell_id], 0.7, {
      opacity: 0,
      scaleX: 0,
      scaleY: 0,
      ease: Power4.easeOut,
    });

    this.socket.emit('ply_turn', { cell_id });

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
    cell_vals[c] = 'o';

    TweenMax.from(this.refs[c], 0.7, {
      opacity: 0,
      scaleX: 0,
      scaleY: 0,
      ease: Power4.easeOut,
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
  //	------------------------	------------------------	------------------------

  check_turn() {
    const { cell_vals } = this.state;

    let win = false;
    let set;
    let fin = true;

    if (this.props.game_type != 'live') this.state.game_stat = 'Play';

    for (let i = 0; !win && i < this.win_sets.length; i++) {
      set = this.win_sets[i];
      const first = cell_vals[set[0]];
      if (first && set.every((c) => cell_vals[c] === first)) win = true;
    }

    for (let i = 1; i <= this.totalCells; i++)
      !cell_vals['c' + i] && (fin = false);

    // win && console.log('win set: ', set)

    if (win) {
      set.forEach((c) => this.refs[c] && this.refs[c].classList.add('win'));

      TweenMax.killAll(true);
      TweenMax.from('td.win', 1, { opacity: 0, ease: Linear.easeIn });

      const playerWon = cell_vals[set[0]] == 'x';
      this.setState({
        game_stat: (playerWon ? 'You' : 'Opponent') + ' win',
        game_play: false,
      });

      this.socket && this.socket.disconnect();

      this._gameResultTimeout = setTimeout(() => {
        this._gameResultTimeout = null;
        if (!this.state.game_result) {
          this.setState({ game_result: playerWon ? 'win' : 'lose' });
        }
      }, 1400);
    } else if (fin) {
      this.setState({
        game_stat: 'Draw',
        game_play: false,
      });

      this.socket && this.socket.disconnect();

      this._gameResultTimeout = setTimeout(() => {
        this._gameResultTimeout = null;
        if (!this.state.game_result) {
          this.setState({ game_result: 'draw' });
        }
      }, 1200);
    } else {
      this.props.game_type != 'live' &&
        this.state.next_turn_ply &&
        setTimeout(this.turn_comp.bind(this), rand_to_fro(500, 1000));

      this.setState({
        next_turn_ply: !this.state.next_turn_ply,
      });
    }
  }

  //	------------------------	------------------------	------------------------

  end_game() {
    this.socket && this.socket.disconnect();

    this.props.onEndGame();
  }
}
