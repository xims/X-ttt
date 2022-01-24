// externals
import React, { Component } from 'react'
import io from 'socket.io-client'
import TweenMax from 'gsap'

//componets
import LeaderBoard from '../../components/Leaderboard'
// helpers
import rand_arr_elem from '../../helpers/rand_arr_elem'
import rand_to_fro from '../../helpers/rand_to_fro'

export default class GameMain extends Component {
    constructor(props) {
        super(props)

        this.win_sets = [
            ['c1', 'c2', 'c3'],
            ['c4', 'c5', 'c6'],
            ['c7', 'c8', 'c9'],

            ['c1', 'c4', 'c7'],
            ['c2', 'c5', 'c8'],
            ['c3', 'c6', 'c9'],

            ['c1', 'c5', 'c9'],
            ['c3', 'c5', 'c7'],
        ]

        if (this.props.game_type != 'live')
            this.state = {
                cell_vals: {},
                next_turn_ply: true,
                game_play: true,
                game_stat: 'Start game',
                waiting: false,
                start: true,
                opponent: 'CPU',
                playerOneWins: 0,
                playerTwoWins: 0,
            }
        else {
            this.sock_start()

            this.state = {
                cell_vals: {},
                next_turn_ply: true,
                error: false,
                waiting: true,
                playerOneWins: 10,
                playerTwoWins: 0,
            }
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
        })
        TweenMax.from('#game_board', 1, {
            display: 'none',
            opacity: 0,
            x: -200,
            y: -200,
            scaleX: 0,
            scaleY: 0,
            ease: Power4.easeIn,
        })
    }

    //	------------------------	------------------------	------------------------
    //	------------------------	------------------------	------------------------

    sock_start() {
        this.socket = io(app.settings.ws_conf.loc.SOCKET__io.u)

        this.socket.on('connect_error', (err) => this.setState({ error: true }))

        this.socket.on(
            'connect',
            function (data) {
                this.setState({
                    game_play: false,
                    game_stat: 'Connecting',
                    start: true,
                })

                this.socket.emit('new player', {
                    name: app.settings.curr_user.name,
                })
            }.bind(this)
        )

        this.socket.on(
            'pair_players',
            function (data) {
                console.log('!!!!! paired with ', data)

                this.setState({
                    next_turn_ply: data.mode == 'm',
                    game_play: true,
                    game_stat: 'Playing with ' + data.opp.name,
                    waiting: false,
                    start: true,
                    opponent: data.opp.name,
                })
            }.bind(this)
        )

        this.socket.on('opp_turn', this.turn_opp_live.bind(this))
    }

    //	------------------------	------------------------	------------------------
    //	------------------------	------------------------	------------------------

    componentWillUnmount() {
        this.socket && this.socket.disconnect()
    }

    //	------------------------	------------------------	------------------------

    cell_cont(c) {
        const { cell_vals } = this.state

        return (
            <div>
                {cell_vals && cell_vals[c] == 'x' && (
                    <i className="fa fa-times fa-5x"></i>
                )}
                {cell_vals && cell_vals[c] == 'o' && (
                    <i className="fa fa-circle-o fa-5x"></i>
                )}
            </div>
        )
    }

    //	------------------------	------------------------	------------------------

    render() {
        const { cell_vals } = this.state
        let btnText
        this.state.game_play ? (btnText = 'Quit ') : (btnText = 'Rematch! ')
        return (
            <div id="GameMain">
                {this.state.error && (
                    <div style={{ marginTop: '2rem' }}>
                        <h4>Error connecting to server =(</h4>
                        <div>
                            <p>Play single game instead?</p>
                            <div>
                                <button
                                    type="submit"
                                    onClick={this.end_game.bind(this)}
                                    className="button"
                                    style={{ width: 'auto' }}
                                >
                                    <span>
                                        Play against computer
                                        <span className="fa fa-caret-right"></span>
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {!this.state.error && this.state.waiting && (
                    <div>
                        waiting for another to join! waiting{this.state.waiting}
                    </div>
                )}
                {this.state.start && (
                    <div>
                        {/* <h1>Play {this.props.game_type}</h1> */}

                        <div id="game_stat">
                            <div id="game_stat_msg">{this.state.game_stat}</div>
                            {this.state.game_play && (
                                <div id="game_turn_msg">
                                    {this.state.next_turn_ply
                                        ? 'Your turn'
                                        : 'Opponent turn'}
                                </div>
                            )}
                        </div>

                        <div id="game_board">
                            <table>
                                <tbody>
                                    <tr>
                                        <td
                                            id="game_board-c1"
                                            ref="c1"
                                            onClick={this.click_cell.bind(this)}
                                        >
                                            {' '}
                                            {this.cell_cont('c1')}{' '}
                                        </td>
                                        <td
                                            id="game_board-c2"
                                            ref="c2"
                                            onClick={this.click_cell.bind(this)}
                                            className="vbrd"
                                        >
                                            {' '}
                                            {this.cell_cont('c2')}{' '}
                                        </td>
                                        <td
                                            id="game_board-c3"
                                            ref="c3"
                                            onClick={this.click_cell.bind(this)}
                                        >
                                            {' '}
                                            {this.cell_cont('c3')}{' '}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td
                                            id="game_board-c4"
                                            ref="c4"
                                            onClick={this.click_cell.bind(this)}
                                            className="hbrd"
                                        >
                                            {' '}
                                            {this.cell_cont('c4')}{' '}
                                        </td>
                                        <td
                                            id="game_board-c5"
                                            ref="c5"
                                            onClick={this.click_cell.bind(this)}
                                            className="vbrd hbrd"
                                        >
                                            {' '}
                                            {this.cell_cont('c5')}{' '}
                                        </td>
                                        <td
                                            id="game_board-c6"
                                            ref="c6"
                                            onClick={this.click_cell.bind(this)}
                                            className="hbrd"
                                        >
                                            {' '}
                                            {this.cell_cont('c6')}{' '}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td
                                            id="game_board-c7"
                                            ref="c7"
                                            onClick={this.click_cell.bind(this)}
                                        >
                                            {' '}
                                            {this.cell_cont('c7')}{' '}
                                        </td>
                                        <td
                                            id="game_board-c8"
                                            ref="c8"
                                            onClick={this.click_cell.bind(this)}
                                            className="vbrd"
                                        >
                                            {' '}
                                            {this.cell_cont('c8')}{' '}
                                        </td>
                                        <td
                                            id="game_board-c9"
                                            ref="c9"
                                            onClick={this.click_cell.bind(this)}
                                        >
                                            {' '}
                                            {this.cell_cont('c9')}{' '}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <LeaderBoard
                            playerOne={this.props.playerOne}
                            playerTwo={this.state.opponent}
                            playerOneWins={this.state.playerOneWins}
                            playerTwoWins={this.state.playerTwoWins}
                        />

                        <div
                            className="btn-container"
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}
                        >
                            <button
                                type="submit"
                                onClick={this.end_game.bind(this)}
                                className="button"
                            >
                                <span>
                                    Quit{' '}
                                    <span className="fa fa-caret-right"></span>
                                </span>
                            </button>

                            {!this.state.game_play && (
                                <button
                                    type="submit"
                                    onClick={this.rematch.bind(this)}
                                    className="button"
                                >
                                    <span>
                                        Play again{' '}
                                        <span className="fa fa-caret-right"></span>
                                    </span>
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        )
    }

    //	------------------------	------------------------	------------------------
    //	------------------------	------------------------	------------------------

    click_cell(e) {
        // console.log(e.currentTarget.id.substr(11))
        // console.log(e.currentTarget)

        if (!this.state.next_turn_ply || !this.state.game_play) return

        const cell_id = e.currentTarget.id.substr(11)
        if (this.state.cell_vals[cell_id]) return

        if (this.props.game_type != 'live') this.turn_ply_comp(cell_id)
        else this.turn_ply_live(cell_id)
    }

    //	------------------------	------------------------	------------------------
    //	------------------------	------------------------	------------------------

    turn_ply_comp(cell_id) {
        let { cell_vals } = this.state

        cell_vals[cell_id] = 'x'

        TweenMax.from(this.refs[cell_id], 0.7, {
            opacity: 0,
            scaleX: 0,
            scaleY: 0,
            ease: Power4.easeOut,
        })

        // this.setState({
        // 	cell_vals: cell_vals,
        // 	next_turn_ply: false
        // })

        // setTimeout(this.turn_comp.bind(this), rand_to_fro(500, 1000));

        this.state.cell_vals = cell_vals

        this.check_turn()
    }

    //	------------------------	------------------------	------------------------

    turn_comp() {
        let { cell_vals } = this.state
        let empty_cells_arr = []

        for (let i = 1; i <= 9; i++)
            !cell_vals['c' + i] && empty_cells_arr.push('c' + i)
        // console.log(cell_vals, empty_cells_arr, rand_arr_elem(empty_cells_arr))

        const c = rand_arr_elem(empty_cells_arr)
        cell_vals[c] = 'o'

        TweenMax.from(this.refs[c], 0.7, {
            opacity: 0,
            scaleX: 0,
            scaleY: 0,
            ease: Power4.easeOut,
        })

        // this.setState({
        // 	cell_vals: cell_vals,
        // 	next_turn_ply: true
        // })

        this.state.cell_vals = cell_vals

        this.check_turn()
    }

    //	------------------------	------------------------	------------------------
    //	------------------------	------------------------	------------------------

    turn_ply_live(cell_id) {
        let { cell_vals } = this.state

        cell_vals[cell_id] = 'x'

        TweenMax.from(this.refs[cell_id], 0.7, {
            opacity: 0,
            scaleX: 0,
            scaleY: 0,
            ease: Power4.easeOut,
        })

        this.socket.emit('ply_turn', { cell_id: cell_id })

        // this.setState({
        // 	cell_vals: cell_vals,
        // 	next_turn_ply: false
        // })

        // setTimeout(this.turn_comp.bind(this), rand_to_fro(500, 1000));

        this.state.cell_vals = cell_vals

        this.check_turn()
    }

    //	------------------------	------------------------	------------------------

    turn_opp_live(data) {
        let { cell_vals } = this.state
        let empty_cells_arr = []

        const c = data.cell_id
        cell_vals[c] = 'o'

        TweenMax.from(this.refs[c], 0.7, {
            opacity: 0,
            scaleX: 0,
            scaleY: 0,
            ease: Power4.easeOut,
        })

        // this.setState({
        // 	cell_vals: cell_vals,
        // 	next_turn_ply: true
        // })

        this.state.cell_vals = cell_vals

        this.check_turn()
    }

    //	------------------------	------------------------	------------------------
    //	------------------------	------------------------	------------------------
    //	------------------------	------------------------	------------------------

    check_turn() {
        const { cell_vals } = this.state

        let win = false
        let set
        let fin = true

        if (this.props.game_type != 'live') this.state.game_stat = 'Play'

        for (let i = 0; !win && i < this.win_sets.length; i++) {
            set = this.win_sets[i]
            if (
                cell_vals[set[0]] &&
                cell_vals[set[0]] == cell_vals[set[1]] &&
                cell_vals[set[0]] == cell_vals[set[2]]
            )
                win = true
        }

        for (let i = 1; i <= 9; i++) !cell_vals['c' + i] && (fin = false)

        // win && console.log('win set: ', set)

        if (win) {
            this.refs[set[0]].classList.add('win')
            this.refs[set[1]].classList.add('win')
            this.refs[set[2]].classList.add('win')

            TweenMax.killAll(true)
            TweenMax.from('td.win', 1, { opacity: 0, ease: Linear.easeIn })

            if (cell_vals[set[0]] == 'x') {
                console.log('you win')
                this.setState({ playerOneWins: this.state.playerOneWins + 1 })
            } else {
                console.log('you lose')
                this.setState({ playerTwoWins: this.state.playerTwoWins + 1 })
            }

            this.setState({
                game_stat:
                    (cell_vals[set[0]] == 'x' ? 'You' : 'Opponent') + ' win',
                game_play: false,
            })

            this.socket && this.socket.disconnect()
        } else if (fin) {
            this.setState({
                game_stat: 'Draw',
                game_play: false,
            })

            this.socket && this.socket.disconnect()
        } else {
            this.props.game_type != 'live' &&
                this.state.next_turn_ply &&
                setTimeout(this.turn_comp.bind(this), rand_to_fro(500, 1000))

            this.setState({
                next_turn_ply: !this.state.next_turn_ply,
            })
        }
    }

    //	------------------------	------------------------	------------------------

    rematch() {
        this.setState({
            cell_vals: {},
            next_turn_ply: true,
            game_play: true,
            game_stat: 'Start game',
            waiting: false,
            start: true,
        })

        var ele = document.getElementsByClassName('win')

        while (ele.length) {
            ele[0].classList.remove('win')
        }
    }

    end_game() {
        this.socket && this.socket.disconnect()

        this.props.onEndGame()
    }
}
