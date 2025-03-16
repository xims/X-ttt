import React, { Component, createRef } from "react";
import PropTypes from "prop-types";

import io from "socket.io-client";

import { gsap, Power4, Linear } from "gsap";

import rand_arr_elem from "../../helpers/rand_arr_elem";
import rand_to_fro from "../../helpers/rand_to_fro";
import Timer from "./Timer";

export default class GameMain extends Component {
  constructor(props) {
    super(props);

    // Create refs for all cells using modern React.createRef
    this.cellRefs = {
      c1: createRef(),
      c2: createRef(),
      c3: createRef(),
      c4: createRef(),
      c5: createRef(),
      c6: createRef(),
      c7: createRef(),
      c8: createRef(),
      c9: createRef(),
    };

    // Create ref for game board
    this.gameBoardRef = createRef();
    this.gameStatRef = createRef();

    this.win_sets = [
      ["c1", "c2", "c3"],
      ["c4", "c5", "c6"],
      ["c7", "c8", "c9"],

      ["c1", "c4", "c7"],
      ["c2", "c5", "c8"],
      ["c3", "c6", "c9"],

      ["c1", "c5", "c9"],
      ["c3", "c5", "c7"],
    ];

    // Get username from window.app.settings if available, otherwise use "Player"
    this.username =
      window.app && window.app.settings && window.app.settings.curr_user
        ? window.app.settings.curr_user.name
        : "Player";

    // Bind methods once in constructor instead of in render
    this.click_cell = this.click_cell.bind(this);
    this.end_game = this.end_game.bind(this);
    this.turn_comp = this.turn_comp.bind(this);
    this.turn_ply_comp = this.turn_ply_comp.bind(this);
    this.turn_ply_live = this.turn_ply_live.bind(this);
    this.turn_opp_live = this.turn_opp_live.bind(this);
    this.check_turn = this.check_turn.bind(this);

    if (this.props.game_type.type !== "live")
      this.state = {
        cell_vals: {},
        next_turn_ply: true,
        game_play: true,
        game_stat: "Start game",
        showVictoryNotification: false,
        victoryMessage: "",
        socketError: null,
        winningCells: [],
        showSymbolSelection: false,
        playerSymbol: null, // 'x' or 'o'
        opponentSymbol: null, // Will be the opposite of playerSymbol
      };
    else {
      this.sock_start();

      this.state = {
        cell_vals: {},
        next_turn_ply: true,
        game_play: false,
        game_stat: "Connecting",
        showVictoryNotification: false,
        victoryMessage: "",
        socketError: null,
        winningCells: [],
        showSymbolSelection: false,
        playerSymbol: null,
        opponentSymbol: null,
      };
    }
  }

  componentDidMount() {
    // Use refs instead of document.getElementById
    if (this.gameStatRef.current) {
      gsap.from(this.gameStatRef.current, {
        duration: 1,
        opacity: 0,
        scaleX: 0,
        scaleY: 0,
        ease: Power4.easeIn,
      });
    }

    // Use ref for game board instead of direct DOM manipulation
    if (this.gameBoardRef.current) {
      this.gameBoardRef.current.style.display = "block";
      this.gameBoardRef.current.style.opacity = "1";

      gsap.from(this.gameBoardRef.current, {
        duration: 1,
        x: -200,
        y: -200,
        scaleX: 0,
        scaleY: 0,
        ease: Power4.easeIn,
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // Check if we have a winning set and should re-apply the styling
    if (
      this.state.winningSet &&
      (prevState.showVictoryNotification !==
        this.state.showVictoryNotification ||
        !prevState.winningSet)
    ) {
      // Don't reapply styles if we're resetting the game
      if (
        prevState.showVictoryNotification &&
        !this.state.showVictoryNotification
      ) {
        return; // Skip reapplying styles when closing the victory notification
      }

      const set = this.state.winningSet;

      // Make sure we have the cell refs before proceeding
      if (
        this.cellRefs[set[0]].current &&
        this.cellRefs[set[1]].current &&
        this.cellRefs[set[2]].current
      ) {
        const winningCells = [
          this.cellRefs[set[0]].current,
          this.cellRefs[set[1]].current,
          this.cellRefs[set[2]].current,
        ];

        // Re-apply the styling to ensure it's visible
        winningCells.forEach((cell) => {
          cell.classList.add("win");
          cell.style.backgroundColor = "#ffcc00";
          cell.style.border = "4px solid #ff8800";
          cell.style.position = "relative";
          cell.style.zIndex = "5";
          cell.style.boxShadow = "0 0 15px #ffd700";

          // Make the cell content more prominent
          const icon = cell.querySelector("i.fa");
          if (icon) {
            if (icon.classList.contains("fa-times")) {
              icon.style.color = "#ff0000";
              icon.style.filter = "drop-shadow(0 0 5px rgba(255, 0, 0, 0.7))";
              icon.style.transform = "scale(1.2)";
            } else if (icon.classList.contains("fa-circle-o")) {
              icon.style.color = "#0000ff";
              icon.style.filter = "drop-shadow(0 0 5px rgba(0, 0, 255, 0.7))";
              icon.style.transform = "scale(1.2)";
            }
          }
        });
      }
    }
  }

  sock_start() {
    // Get the origin for the current window
    const origin = window.location.origin;
    console.log("Attempting to connect to socket server at:", origin);
    console.log("Username being sent:", this.username);

    try {
      // Configure Socket.io with explicit options
      this.socket = io(origin, {
        transports: ["websocket", "polling"], // Try WebSocket first, fall back to polling
        reconnectionAttempts: 5, // Try to reconnect 5 times
        reconnectionDelay: 1000, // Start with 1 second delay between attempts
        timeout: 10000, // 10 second connection timeout
        autoConnect: true, // Connect automatically
        forceNew: true, // Force a new connection
      });

      // Connection monitoring events
      this.socket.on("connect", () => {
        console.log("Socket connected successfully with ID:", this.socket.id);
        this.setState({
          socketError: null,
          game_stat: "Connected - waiting for opponent",
        });
        console.log("Emitting 'new player' event with name:", this.username);
        this.socket.emit("new player", { name: this.username });
      });

      // Debug all incoming socket events
      this.socket.onAny((eventName, ...args) => {
        console.log(`SOCKET EVENT [${eventName}]:`, args);
      });

      this.socket.on("pair_players", (data) => {
        console.log("Paired with player:", data.opp.name);
        console.log("Full pairing data:", JSON.stringify(data));
        console.log(
          "Game mode assigned:",
          data.mode === "m" ? "Master" : "Slave"
        );

        // Set a flag to track that we received the pairing event
        window._receivedPairingEvent = true;

        // For player 1 (master), show symbol selection popup
        // Player 2 (slave) will receive the symbol choice from player 1
        const isMaster = data.mode === "m";

        this.setState(
          {
            next_turn_ply: isMaster, // Master goes first
            game_play: true,
            game_stat: "Playing with " + data.opp.name,
            oppName: data.opp.name, // Store opponent name in state
            showSymbolSelection: isMaster, // Only show the selection to player 1
            isMaster: isMaster,
          },
          () => {
            // After state update, verify the UI is reflecting the pairing
            console.log(
              "State updated after pairing. Game state:",
              this.state.game_play ? "Playing" : "Not playing",
              "Game status:",
              this.state.game_stat
            );
          }
        );
      });

      // Add handler for symbol_assigned event
      this.socket.on("symbol_assigned", (data) => {
        console.log("Symbol assigned by opponent:", data);
        this.setState({
          playerSymbol: data.symbol,
          opponentSymbol: data.opponentSymbol,
          next_turn_ply: data.yourTurn,
        });
      });

      // Add handler for reconnect_game event
      this.socket.on("reconnect_game", (data) => {
        console.log("Game reconnected with opponent:", data.opponent.name);

        this.setState({
          game_play: true,
          next_turn_ply: data.yourTurn,
          game_stat: "Playing with " + data.opponent.name,
          oppName: data.opponent.name,
          playerSymbol: data.symbol,
          opponentSymbol: data.opponentSymbol,
          cell_vals: {}, // Reset the board
          showVictoryNotification: false,
        });
      });

      this.socket.on("opp_turn", this.turn_opp_live);

      // Add opponent left handler
      this.socket.on("opponent_left", (data) => {
        console.log("Opponent left the game:", data.message);
        this.setState({
          game_play: false,
          game_stat: "Opponent left",
          showVictoryNotification: true,
          victoryMessage: data.message || "Your opponent has left the game.",
        });
      });

      // Enhanced error handling
      this.socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error.message);
        this.setState({
          socketError: "Failed to connect to game server. Please try again.",
          game_stat: "Connection error",
        });
      });

      this.socket.on("error", (error) => {
        console.error("Socket error:", error);
        this.setState({
          socketError: "Game server error. Please try again.",
          game_stat: "Server error",
        });
      });

      this.socket.on("disconnect", (reason) => {
        console.log("Socket disconnected. Reason:", reason);
        this.setState({
          socketError: "Disconnected from game server: " + reason,
          game_play: false,
          game_stat: "Disconnected",
        });
      });
    } catch (error) {
      console.error("Error setting up socket:", error);
      this.setState({
        socketError: "Failed to initialize game connection. Please try again.",
        game_stat: "Connection error",
      });
    }
  }

  componentWillUnmount() {
    // Clean up socket connection on unmount
    if (this.socket) {
      try {
        this.socket.disconnect();
      } catch (error) {
        console.error("Error disconnecting socket:", error);
      }
    }
  }

  cell_cont(c) {
    const { cell_vals } = this.state;

    // If the cell has a value, show the icon
    if (cell_vals && cell_vals[c] === "x") {
      return (
        <div
          className="cell-content x-mark"
          style={{
            fontSize: "48px",
            color: "#ff0000",
            position: "relative",
            zIndex: "15",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <i
            className="fa fa-times fa-3x"
            aria-label="X mark"
            style={{
              position: "relative",
              zIndex: "20",
              display: "block",
            }}
          ></i>
        </div>
      );
    } else if (cell_vals && cell_vals[c] === "o") {
      return (
        <div
          className="cell-content o-mark"
          style={{
            fontSize: "48px",
            color: "#0000ff",
            position: "relative",
            zIndex: "15",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <i
            className="fa fa-circle-o fa-3x"
            aria-label="O mark"
            style={{
              position: "relative",
              zIndex: "20",
              display: "block",
            }}
          ></i>
        </div>
      );
    } else {
      // Always show a placeholder for empty cells
      return (
        <div
          className="cell-content empty"
          style={{
            height: "50px",
            width: "50px",
            display: "block",
          }}
          aria-label="Empty cell"
        ></div>
      );
    }
  }

  render() {
    const {
      cell_vals,
      next_turn_ply,
      game_play,
      game_stat,
      showVictoryNotification,
      victoryMessage,
      socketError,
      winningCells,
      showSymbolSelection,
      playerSymbol,
      opponentSymbol,
    } = this.state;
    const { game_type } = this.props;

    return (
      <div id="GameMain">
        <h1>Play {game_type.type}</h1>

        <div id="game_stat" ref={this.gameStatRef} role="status">
          <div id="game_stat_msg">{game_stat}</div>
          {game_play && (
            <div id="game_turn_msg">
              {next_turn_ply ? "Your turn" : "Opponent turn"}
            </div>
          )}
        </div>

        {socketError && (
          <div className="error-message" role="alert">
            {socketError}
          </div>
        )}

        {game_play && next_turn_ply && (
          <Timer
            key={`timer-${Object.keys(cell_vals).length}`}
            timeLimit={game_type.timeLimit}
            onTimeUp={this.handleTimeUp}
          />
        )}

        {/* Symbol Selection Popup */}
        {showSymbolSelection && (
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 0 20px rgba(0,0,0,0.5)",
              zIndex: 30,
              textAlign: "center",
              backdropFilter: "blur(5px)",
              border: "2px solid #2196F3",
              maxWidth: "80%",
              width: "300px",
            }}
            role="dialog"
            aria-labelledby="symbol-selection"
          >
            <h2
              id="symbol-selection"
              style={{ margin: "0 0 20px 0", color: "#333" }}
            >
              Choose Your Symbol
            </h2>
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                gap: "20px",
                marginBottom: "20px",
              }}
            >
              <button
                onClick={() => this.selectSymbol("x")}
                style={{
                  padding: "15px 25px",
                  backgroundColor: "#ff5252",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "24px",
                  fontWeight: "bold",
                  width: "100px",
                  height: "100px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                X
              </button>
              <button
                onClick={() => this.selectSymbol("o")}
                style={{
                  padding: "15px 25px",
                  backgroundColor: "#2979ff",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "24px",
                  fontWeight: "bold",
                  width: "100px",
                  height: "100px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                O
              </button>
            </div>
            <p style={{ color: "#666", marginBottom: "0" }}>
              Choose X to go first or O to go second
            </p>
          </div>
        )}

        <div
          id="game_board"
          ref={this.gameBoardRef}
          style={{
            display: "block",
            opacity: 1,
            border: "none",
            margin: "20px",
            position: "relative",
            zIndex: 1,
          }}
          role="grid"
          aria-label="Tic Tac Toe Game Board"
        >
          <table
            style={{
              border: "none",
              borderCollapse: "collapse",
              background: "#fff",
              margin: "10px",
            }}
          >
            <tbody>
              <tr>
                <td
                  id="game_board-c1"
                  ref={this.cellRefs.c1}
                  onClick={this.click_cell}
                  style={{
                    border: "1px solid black",
                    background: "#f0f0f0",
                    width: "100px",
                    height: "100px",
                  }}
                  role="gridcell"
                  aria-label={
                    cell_vals.c1
                      ? `Cell 1: ${cell_vals.c1 === "x" ? "X" : "O"}`
                      : "Cell 1: empty"
                  }
                  tabIndex={0}
                >
                  {this.cell_cont("c1")}
                </td>
                <td
                  id="game_board-c2"
                  ref={this.cellRefs.c2}
                  onClick={this.click_cell}
                  className="vbrd"
                  style={{
                    border: "1px solid black",
                    background: "#f0f0f0",
                    width: "100px",
                    height: "100px",
                  }}
                  role="gridcell"
                  aria-label={
                    cell_vals.c2
                      ? `Cell 2: ${cell_vals.c2 === "x" ? "X" : "O"}`
                      : "Cell 2: empty"
                  }
                  tabIndex={0}
                >
                  {this.cell_cont("c2")}
                </td>
                <td
                  id="game_board-c3"
                  ref={this.cellRefs.c3}
                  onClick={this.click_cell}
                  style={{
                    border: "1px solid black",
                    background: "#f0f0f0",
                    width: "100px",
                    height: "100px",
                  }}
                  role="gridcell"
                  aria-label={
                    cell_vals.c3
                      ? `Cell 3: ${cell_vals.c3 === "x" ? "X" : "O"}`
                      : "Cell 3: empty"
                  }
                  tabIndex={0}
                >
                  {this.cell_cont("c3")}
                </td>
              </tr>
              <tr>
                <td
                  id="game_board-c4"
                  ref={this.cellRefs.c4}
                  onClick={this.click_cell}
                  className="hbrd"
                  style={{
                    border: "1px solid black",
                    background: "#f0f0f0",
                    width: "100px",
                    height: "100px",
                  }}
                  role="gridcell"
                  aria-label={
                    cell_vals.c4
                      ? `Cell 4: ${cell_vals.c4 === "x" ? "X" : "O"}`
                      : "Cell 4: empty"
                  }
                  tabIndex={0}
                >
                  {this.cell_cont("c4")}
                </td>
                <td
                  id="game_board-c5"
                  ref={this.cellRefs.c5}
                  onClick={this.click_cell}
                  className="vbrd hbrd"
                  style={{
                    border: "1px solid black",
                    background: "#f0f0f0",
                    width: "100px",
                    height: "100px",
                  }}
                  role="gridcell"
                  aria-label={
                    cell_vals.c5
                      ? `Cell 5: ${cell_vals.c5 === "x" ? "X" : "O"}`
                      : "Cell 5: empty"
                  }
                  tabIndex={0}
                >
                  {this.cell_cont("c5")}
                </td>
                <td
                  id="game_board-c6"
                  ref={this.cellRefs.c6}
                  onClick={this.click_cell}
                  className="hbrd"
                  style={{
                    border: "1px solid black",
                    background: "#f0f0f0",
                    width: "100px",
                    height: "100px",
                  }}
                  role="gridcell"
                  aria-label={
                    cell_vals.c6
                      ? `Cell 6: ${cell_vals.c6 === "x" ? "X" : "O"}`
                      : "Cell 6: empty"
                  }
                  tabIndex={0}
                >
                  {this.cell_cont("c6")}
                </td>
              </tr>
              <tr>
                <td
                  id="game_board-c7"
                  ref={this.cellRefs.c7}
                  onClick={this.click_cell}
                  style={{
                    border: "1px solid black",
                    background: "#f0f0f0",
                    width: "100px",
                    height: "100px",
                  }}
                  role="gridcell"
                  aria-label={
                    cell_vals.c7
                      ? `Cell 7: ${cell_vals.c7 === "x" ? "X" : "O"}`
                      : "Cell 7: empty"
                  }
                  tabIndex={0}
                >
                  {this.cell_cont("c7")}
                </td>
                <td
                  id="game_board-c8"
                  ref={this.cellRefs.c8}
                  onClick={this.click_cell}
                  className="vbrd"
                  style={{
                    border: "1px solid black",
                    background: "#f0f0f0",
                    width: "100px",
                    height: "100px",
                  }}
                  role="gridcell"
                  aria-label={
                    cell_vals.c8
                      ? `Cell 8: ${cell_vals.c8 === "x" ? "X" : "O"}`
                      : "Cell 8: empty"
                  }
                  tabIndex={0}
                >
                  {this.cell_cont("c8")}
                </td>
                <td
                  id="game_board-c9"
                  ref={this.cellRefs.c9}
                  onClick={this.click_cell}
                  style={{
                    border: "1px solid black",
                    background: "#f0f0f0",
                    width: "100px",
                    height: "100px",
                  }}
                  role="gridcell"
                  aria-label={
                    cell_vals.c9
                      ? `Cell 9: ${cell_vals.c9 === "x" ? "X" : "O"}`
                      : "Cell 9: empty"
                  }
                  tabIndex={0}
                >
                  {this.cell_cont("c9")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Victory notification popup */}
        {showVictoryNotification && (
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 0 20px rgba(0,0,0,0.5)",
              zIndex: 20,
              textAlign: "center",
              backdropFilter: "blur(3px)",
              border: "2px solid #4CAF50",
              maxWidth: "80%",
              width: "300px",
            }}
            role="dialog"
            aria-labelledby="game-result"
          >
            <h2
              id="game-result"
              style={{ margin: "0 0 20px 0", color: "#333" }}
            >
              {victoryMessage}
            </h2>
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                gap: "10px",
              }}
            >
              <button
                onClick={this.reset_game}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#2196F3", // Blue for new game
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
              >
                New Game
              </button>
              <button
                onClick={this.end_game}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#4CAF50", // Green for home
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
              >
                Back to Home
              </button>
            </div>
          </div>
        )}

        <button
          type="submit"
          onClick={this.end_game}
          className="button"
          aria-label="End Game"
        >
          <span>
            End Game <span className="fa fa-caret-right"></span>
          </span>
        </button>
      </div>
    );
  }

  click_cell(e) {
    if (!this.state.next_turn_ply || !this.state.game_play) return;

    const cell_id = e.currentTarget.id.substr(11);
    if (this.state.cell_vals[cell_id]) return;

    if (this.props.game_type.type != "live") this.turn_ply_comp(cell_id);
    else this.turn_ply_live(cell_id);
  }

  turn_ply_comp(cell_id) {
    let { cell_vals } = this.state;

    // Create a new cell_vals object to avoid direct state mutation
    const newCellVals = { ...cell_vals };
    newCellVals[cell_id] = "x";

    // Use ref instead of string ref
    if (this.cellRefs[cell_id].current) {
      gsap.from(this.cellRefs[cell_id].current, {
        duration: 0.7,
        opacity: 0,
        scaleX: 0,
        scaleY: 0,
        ease: Power4.easeOut,
      });
    }

    // Update state properly
    this.setState(
      {
        cell_vals: newCellVals,
      },
      () => {
        // Call check_turn after state is updated
        this.check_turn();
      }
    );
  }

  turn_comp() {
    let { cell_vals } = this.state;
    let empty_cells_arr = [];

    for (let i = 1; i <= 9; i++)
      !cell_vals["c" + i] && empty_cells_arr.push("c" + i);

    const c = rand_arr_elem(empty_cells_arr);

    // Create a new cell_vals object to avoid direct state mutation
    const newCellVals = { ...cell_vals };
    newCellVals[c] = "o";

    // Use ref instead of string ref
    if (this.cellRefs[c].current) {
      gsap.from(this.cellRefs[c].current, {
        duration: 0.7,
        opacity: 0,
        scaleX: 0,
        scaleY: 0,
        ease: Power4.easeOut,
      });
    }

    // Update state properly
    this.setState(
      {
        cell_vals: newCellVals,
      },
      () => {
        // Call check_turn after state is updated
        this.check_turn();
      }
    );
  }

  turn_ply_live(cell_id) {
    let { cell_vals, playerSymbol } = this.state;

    // Default to 'x' if symbol not set yet (shouldn't happen)
    const symbol = playerSymbol || "x";

    // Create a new cell_vals object to avoid direct state mutation
    const newCellVals = { ...cell_vals };
    newCellVals[cell_id] = symbol;

    // Use ref instead of string ref
    if (this.cellRefs[cell_id].current) {
      gsap.from(this.cellRefs[cell_id].current, {
        duration: 0.7,
        opacity: 0,
        scaleX: 0,
        scaleY: 0,
        ease: Power4.easeOut,
      });
    }

    // Wrap socket emit in try-catch for error handling
    try {
      this.socket.emit("ply_turn", { cell_id: cell_id });
      console.log("Sent turn to server, cell_id:", cell_id);
    } catch (error) {
      console.error("Error sending turn to server:", error);
      this.setState({
        socketError: "Failed to send your move to the server.",
      });
    }

    // Update state properly - explicitly toggle next_turn_ply to false first
    this.setState(
      {
        cell_vals: newCellVals,
        next_turn_ply: false, // Immediately mark it as NOT player's turn
      },
      () => {
        console.log("Player turn complete, now opponent's turn");
        // Call check_turn after state is updated
        this.check_turn();
      }
    );
  }

  turn_opp_live(data) {
    let { cell_vals, opponentSymbol } = this.state;
    console.log("Received opponent turn:", data.cell_id);

    // Default to 'o' if symbol not set yet (shouldn't happen)
    const symbol = opponentSymbol || "o";

    const c = data.cell_id;

    // Create a new cell_vals object to avoid direct state mutation
    const newCellVals = { ...cell_vals };
    newCellVals[c] = symbol;

    // Use ref instead of string ref
    if (this.cellRefs[c].current) {
      gsap.from(this.cellRefs[c].current, {
        duration: 0.7,
        opacity: 0,
        scaleX: 0,
        scaleY: 0,
        ease: Power4.easeOut,
      });
    }

    // Update state properly - explicitly toggle next_turn_ply to true
    this.setState(
      {
        cell_vals: newCellVals,
        next_turn_ply: true, // Immediately mark it as player's turn
      },
      () => {
        console.log("Opponent turn complete, now player's turn");
        // Call check_turn after state is updated
        this.check_turn();
      }
    );
  }

  check_turn() {
    const { cell_vals, next_turn_ply } = this.state;
    console.log("Checking turn status, next_turn_ply:", next_turn_ply);

    let win = false;
    let set;
    let fin = true;

    // Create a local variable for game_stat to avoid direct state mutation
    let currentGameStat = this.state.game_stat;

    if (this.props.game_type.type != "live") currentGameStat = "Play";

    // First, check if this completes the game
    for (let i = 0; !win && i < this.win_sets.length; i++) {
      set = this.win_sets[i];
      if (
        cell_vals[set[0]] &&
        cell_vals[set[0]] == cell_vals[set[1]] &&
        cell_vals[set[0]] == cell_vals[set[2]]
      )
        win = true;
    }

    for (let i = 1; i <= 9; i++) !cell_vals["c" + i] && (fin = false);

    // If it's a win, handle it properly with visuals first
    if (win) {
      // Make sure we have refs before proceeding
      if (
        !this.cellRefs[set[0]].current ||
        !this.cellRefs[set[1]].current ||
        !this.cellRefs[set[2]].current
      ) {
        console.error("Missing cell refs for win highlight");
        return;
      }

      // First, highlight the winning cells with a clear visual indicator
      const winningCells = [
        this.cellRefs[set[0]].current,
        this.cellRefs[set[1]].current,
        this.cellRefs[set[2]].current,
      ];

      // Create a visual connection between winning cells (a winning line)
      const drawWinningLine = () => {
        // Apply permanent highlighting to the winning cells
        winningCells.forEach((cell) => {
          // Add win class to all winning cells
          cell.classList.add("win");

          // Set direct style properties for extra certainty
          cell.style.backgroundColor = "#ffcc00";
          cell.style.border = "4px solid #ff8800";
          cell.style.position = "relative";
          cell.style.zIndex = "5";
          cell.style.boxShadow = "0 0 15px #ffd700";

          // Find and ensure the icon remains visible
          const iconContainer = cell.querySelector("div");
          if (iconContainer) {
            // Adjust the container to ensure visibility
            iconContainer.style.position = "relative";
            iconContainer.style.zIndex = "15"; // Higher than the cell::after z-index

            // Find the actual icon
            const icon = iconContainer.querySelector("i.fa");
            if (icon) {
              // Ensure icon is visible and styled
              icon.style.position = "relative";
              icon.style.zIndex = "20"; // Even higher z-index

              if (icon.classList.contains("fa-times")) {
                icon.style.color = "#ff0000";
                icon.style.filter = "drop-shadow(0 0 5px rgba(255, 0, 0, 0.7))";
                icon.style.transform = "scale(1.2)";
              } else if (icon.classList.contains("fa-circle-o")) {
                icon.style.color = "#0000ff";
                icon.style.filter = "drop-shadow(0 0 5px rgba(0, 0, 255, 0.7))";
                icon.style.transform = "scale(1.2)";
              }
            }
          }
        });
      };

      // Draw the initial winning line
      drawWinningLine();

      // Store winning cells in state for later use
      this.setState({
        winningCells: [set[0], set[1], set[2]],
        winningSet: set,
      });

      // Create a visual animation for the winning line
      gsap.killTweensOf("td.win");
      gsap.from("td.win", {
        duration: 0.7,
        opacity: 0.5,
        scale: 0.9,
        ease: Linear.easeIn,
        stagger: 0.1, // Stagger the animations for each cell
      });

      // Add a persistent pulse animation to maintain focus
      gsap.to("td.win", {
        duration: 0.8,
        backgroundColor: "#ffdd00",
        yoyo: true,
        repeat: -1, // Infinite repeat
        ease: Power4.easeInOut,
      });

      // Determine the winner based on the symbol in the winning cells
      const winningSymbol = cell_vals[set[0]];
      const isPlayerWinner = winningSymbol === this.state.playerSymbol;
      const winner = isPlayerWinner ? "You" : "Opponent";
      const victoryMessage = `${winner} won the game!`;

      // Update game state but keep game playable until animations complete
      this.setState({
        game_stat: victoryMessage,
      });

      // After animations have played, end the game and show popup
      setTimeout(() => {
        // Ensure winning line is still visible
        drawWinningLine();

        this.setState({
          game_play: false,
        });

        // Show the notification after user has had time to see the winning line
        // The winning line will continue to be highlighted during the popup
        setTimeout(() => {
          // Draw the winning line one final time to ensure it remains visible
          drawWinningLine();

          this.setState({
            showVictoryNotification: true,
            victoryMessage: victoryMessage,
          });
        }, 1200);
      }, 1000);

      // We no longer disconnect the socket when the game ends
      // This allows us to reconnect with the same opponent for a new game
    } else if (fin) {
      // Handle draw - show clear visual indication
      // Highlight all cells to indicate draw
      for (let i = 1; i <= 9; i++) {
        const cellKey = "c" + i;
        if (this.cellRefs[cellKey] && this.cellRefs[cellKey].current) {
          this.cellRefs[cellKey].current.style.backgroundColor = "#e0e0e0";
          this.cellRefs[cellKey].current.style.transition =
            "background-color 0.5s ease";
        }
      }

      this.setState({
        game_stat: "Draw",
      });

      // After visual indication, end the game and show notification
      setTimeout(() => {
        this.setState({
          game_play: false,
        });

        setTimeout(() => {
          this.setState({
            showVictoryNotification: true,
            victoryMessage: "Game ended in a draw!",
          });
        }, 1500);
      }, 1000);
    } else {
      // Normal gameplay continues
      if (this.props.game_type.type != "live" && next_turn_ply) {
        setTimeout(this.turn_comp, rand_to_fro(500, 1000));
      }

      // For live games, we already set next_turn_ply in turn_ply_live and turn_opp_live
      // Only toggle turn for non-live games
      if (this.props.game_type.type != "live") {
        this.setState({
          next_turn_ply: !next_turn_ply,
          game_stat: currentGameStat,
        });
      } else {
        // For live games, just update the game status text
        if (
          currentGameStat !==
          "Playing with " + (this.state.oppName || "opponent")
        ) {
          this.setState({
            game_stat: currentGameStat,
          });
        }
      }
    }
  }

  end_game() {
    if (this.socket) {
      try {
        this.socket.disconnect();
      } catch (error) {
        console.error("Error disconnecting socket:", error);
      }
    }

    this.props.onEndGame();
  }

  handleTimeUp = () => {
    const { next_turn_ply } = this.state;
    const loser = next_turn_ply ? this.username : "Opponent";
    const timeUpMessage = `Game Over - ${loser} ran out of time!`;

    // First update only the game status
    this.setState({
      game_stat: timeUpMessage,
    });

    // After a delay, end the game
    setTimeout(() => {
      this.setState({
        game_play: false,
      });

      // Add another delay before showing the popup
      setTimeout(() => {
        this.setState({
          showVictoryNotification: true,
          victoryMessage: timeUpMessage,
        });
      }, 1500);
    }, 1000);
  };

  reset_game = () => {
    // Kill all GSAP animations first
    gsap.killTweensOf("td.win");
    gsap.killTweensOf(".win");
    gsap.killTweensOf("td");

    // More thorough cleanup for all cells
    for (let i = 1; i <= 9; i++) {
      const cellKey = "c" + i;
      if (this.cellRefs[cellKey] && this.cellRefs[cellKey].current) {
        const cell = this.cellRefs[cellKey].current;

        // More thorough cleanup - remove all classes except grid positioning classes
        const isVbrd = cell.className.includes("vbrd");
        const isHbrd = cell.className.includes("hbrd");

        // Reset the className completely
        cell.className = "";

        // Re-add only grid classes
        if (isVbrd) cell.className += " vbrd";
        if (isHbrd) cell.className += " hbrd";

        // Complete style reset
        cell.removeAttribute("style");

        // Re-apply only the necessary base styles
        cell.style.border = "1px solid black";
        cell.style.background = "#f0f0f0";
        cell.style.width = "100px";
        cell.style.height = "100px";
        cell.style.position = "relative"; // Ensure position is set for proper layout
        cell.style.cursor = "pointer"; // Explicitly make clickable

        // Make sure any pointer-events or other interaction blocking is removed
        cell.style.pointerEvents = "auto";

        // Reset any ARIA attributes that might affect interaction
        cell.setAttribute("aria-disabled", "false");

        // We don't clear innerHTML here anymore to let React handle cell content
      }
    }

    // Ensure the table and game board have proper styling
    if (this.gameBoardRef.current) {
      const gameBoardDiv = this.gameBoardRef.current;
      gameBoardDiv.style.display = "block";
      gameBoardDiv.style.opacity = "1";
      gameBoardDiv.style.border = "none"; // Remove the outer border
      gameBoardDiv.style.margin = "20px";
      gameBoardDiv.style.pointerEvents = "auto"; // Ensure clicks are registered

      const table = gameBoardDiv.querySelector("table");
      if (table) {
        table.style.border = "none"; // Remove table border
        table.style.borderCollapse = "collapse";
        table.style.margin = "10px";
        table.style.background = "#fff";
        table.style.pointerEvents = "auto"; // Ensure clicks are registered
      }
    }

    // Store the current opponent name and symbols for reconnection
    const { oppName, playerSymbol, opponentSymbol, isMaster } = this.state;

    // Reconnect the socket if it was disconnected
    if (!this.socket || !this.socket.connected) {
      console.log("Reconnecting socket for new game");
      // Restart the socket connection
      this.sock_start();
    }

    // Clear all GSAP animations
    gsap.killTweensOf("*");

    // Reset the game state - this is what actually controls the cells' content
    this.setState(
      {
        cell_vals: {}, // Empty board - critical for React to re-render empty cells
        next_turn_ply: playerSymbol === "x", // X always goes first
        game_play: true,
        game_stat: oppName ? `Playing with ${oppName}` : "Start game",
        showVictoryNotification: false,
        victoryMessage: "",
        winningCells: [],
        winningSet: null,
        // Preserve player symbols
        playerSymbol,
        opponentSymbol,
        isMaster,
        oppName,
      },
      () => {
        // After state update, notify the server
        if (this.socket && this.socket.connected && oppName) {
          console.log("Emitting play_again event to reconnect with", oppName);
          this.socket.emit("play_again", {
            playerSymbol,
            opponentSymbol,
            oppName,
          });
        }
      }
    );
  };

  // Add this method to handle symbol selection
  selectSymbol = (symbol) => {
    const oppositeSymbol = symbol === "x" ? "o" : "x";
    console.log(
      `Player selected symbol: ${symbol}, opponent will be: ${oppositeSymbol}`
    );

    // Update local state
    this.setState({
      playerSymbol: symbol,
      opponentSymbol: oppositeSymbol,
      showSymbolSelection: false, // Hide the popup
      // Player 1 (master) should start if they chose 'x', otherwise player 2 starts
      next_turn_ply: this.state.isMaster
        ? symbol === "x"
        : oppositeSymbol === "x",
    });

    // Send the symbol choice to the opponent via the server
    try {
      this.socket.emit("symbol_choice", {
        playerSymbol: symbol,
        opponentSymbol: oppositeSymbol,
      });
    } catch (error) {
      console.error("Error sending symbol choice:", error);
    }
  };
}

GameMain.propTypes = {
  game_type: PropTypes.shape({
    type: PropTypes.string.isRequired,
    timeLimit: PropTypes.number.isRequired,
  }).isRequired,
  onEndGame: PropTypes.func.isRequired,
};
