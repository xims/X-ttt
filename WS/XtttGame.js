// Import util for util.inspect if it's used
const util = require("util");

// ----	--------------------------------------------	--------------------------------------------
// ----	--------------------------------------------	--------------------------------------------

// New player has joined
function onNewPlayer(data) {
  console.log("New player has joined: " + data.name);

  // Create a new player
  var newPlayer = new Player(-1, data.name, "looking");
  newPlayer.sockid = this.id;

  this.player = newPlayer;

  // Add new player to the players array
  players.push(newPlayer);
  players_avail.push(newPlayer);

  console.log(
    "Player available for pairing: " +
      newPlayer.name +
      ", Socket ID: " +
      this.id
  );

  // Clearer debug logging
  console.log(
    `PLAYERS: Total=${players.length}, Available=${players_avail.length}`
  );
  console.log(
    `Available player list: ${players_avail.map((p) => p.name).join(", ")}`
  );

  // Check for pairing immediately
  pair_avail_players();

  // Log the status after pairing attempt
  setTimeout(() => {
    console.log("Current players status after pairing attempt:");
    players.forEach((p) => {
      console.log(
        `Player ${p.name} (${p.sockid}): status=${p.status}, paired=${
          p.opp ? "yes with " + p.opp.name : "no"
        }`
      );
    });
  }, 100);
}

// ----	--------------------------------------------	--------------------------------------------

function pair_avail_players() {
  // Debugging output
  console.log(`Trying to pair players. Available: ${players_avail.length}`);
  if (players_avail.length > 0) {
    console.log(
      "Available players:",
      players_avail.map((p) => `${p.name} (${p.sockid})`).join(", ")
    );
  }

  if (players_avail.length < 2) {
    console.log("Not enough players to make a pair yet");
    return;
  }

  // Get the first two available players
  var p1 = players_avail.shift();
  var p2 = players_avail.shift();

  // Safety check in case player objects are undefined
  if (!p1 || !p2) {
    console.log("Error: Couldn't get two valid players for pairing");
    // Put them back if they exist
    if (p1) players_avail.unshift(p1);
    if (p2) players_avail.unshift(p2);
    return;
  }

  console.log(
    `Pairing player ${p1.name} (${p1.sockid}) with ${p2.name} (${p2.sockid})`
  );

  // Set player modes
  p1.mode = "m";
  p2.mode = "s";

  // Update player status
  p1.status = "paired";
  p2.status = "paired";

  // Connect players to each other
  p1.opp = p2;
  p2.opp = p1;

  // Send the pairing information to both players
  try {
    // Verify socket connections exist
    const socket1 = io.sockets.sockets.get(p1.sockid);
    const socket2 = io.sockets.sockets.get(p2.sockid);

    if (!socket1 || !socket2) {
      throw new Error("One or both player sockets not found");
    }

    // Try direct emission to socket objects
    console.log(
      `Emitting pair_players to Player 1 (${p1.name}) with socket ID ${p1.sockid}`
    );
    socket1.emit("pair_players", {
      opp: { name: p2.name, uid: p2.uid },
      mode: "m",
    });

    console.log(
      `Emitting pair_players to Player 2 (${p2.name}) with socket ID ${p2.sockid}`
    );
    socket2.emit("pair_players", {
      opp: { name: p1.name, uid: p1.uid },
      mode: "s",
    });

    // Log success after emitting both events
    console.log("SUCCESS: Players paired and notified!");
    console.log(
      `Player 1 (${p1.name}) and Player 2 (${p2.name}) are now playing together`
    );
  } catch (error) {
    console.error("Failed to emit pair_players event:", error);

    // Return players to available pool if pairing fails
    p1.status = "looking";
    p2.status = "looking";
    p1.opp = null;
    p2.opp = null;
    players_avail.unshift(p1);
    players_avail.unshift(p2);

    // Try pairing again after a short delay
    setTimeout(pair_avail_players, 1000);
  }
}

// ----	--------------------------------------------	--------------------------------------------

function onTurn(data) {
  // Safety check for player and opponent
  if (!this.player || !this.player.opp) {
    console.error("Player or opponent not found when handling turn");
    return;
  }

  console.log(
    `TURN: Player ${this.player.name} (${this.player.sockid}) made move on cell ${data.cell_id}. Notifying opponent ${this.player.opp.name} (${this.player.opp.sockid})`
  );

  // Get opponent's socket to directly emit (more reliable than using room)
  try {
    const oppSocket = io.sockets.sockets.get(this.player.opp.sockid);
    if (oppSocket) {
      oppSocket.emit("opp_turn", { cell_id: data.cell_id });
      console.log("Successfully sent move to opponent");
    } else {
      console.error("Opponent socket not found:", this.player.opp.sockid);
      // Fallback to using room/to
      io.to(this.player.opp.sockid).emit("opp_turn", { cell_id: data.cell_id });
    }
  } catch (error) {
    console.error("Error sending turn to opponent:", error);
    // Fallback to using room/to
    io.to(this.player.opp.sockid).emit("opp_turn", { cell_id: data.cell_id });
  }

  console.log(
    "turn  --  usr:" +
      this.player.mode +
      " - :" +
      this.player.name +
      "  --  cell_id:" +
      data.cell_id
  );
}

// ----	--------------------------------------------	--------------------------------------------
// ----	--------------------------------------------	--------------------------------------------

// Socket client has disconnected
function onClientDisconnect() {
  console.log("Client disconnected: " + this.id);

  // Safety check if player exists
  if (!this.player) {
    console.log("No player object found for socket: " + this.id);
    return;
  }

  var removePlayer = this.player;

  // Safety check to avoid errors when array indexOf returns -1
  const playerIndex = players.indexOf(removePlayer);
  if (playerIndex !== -1) {
    players.splice(playerIndex, 1);
  }

  const availIndex = players_avail.indexOf(removePlayer);
  if (availIndex !== -1) {
    players_avail.splice(availIndex, 1);
  }

  if (this.status == "admin") {
    console.log("Admin has disconnected: " + this.uid);
    // updAdmin("Admin has disconnected - uid:"+this.uid + "  --  "+this.name);
  } else {
    console.log("Player has disconnected: " + this.id);
    // updAdmin("player disconnected - uid:"+removePlayer.uid + "  --  "+removePlayer.name);
  }

  // If player was paired, notify opponent
  if (removePlayer.opp && io) {
    try {
      console.log("Notifying opponent about disconnection");
      io.to(removePlayer.opp.sockid).emit("opponent_left", {
        message: "Your opponent has left the game.",
      });
    } catch (error) {
      console.error("Error notifying opponent:", error);
    }
  }
}

// ----	--------------------------------------------	--------------------------------------------
// ----	--------------------------------------------	--------------------------------------------

// Add a handler for the symbol choice event
function onSymbolChoice(data) {
  // Make sure the player has an opponent
  if (!this.player || !this.player.opp) {
    console.error("Cannot process symbol choice: player or opponent not found");
    return;
  }

  console.log(
    `Player ${this.player.name} chose symbol ${data.playerSymbol}, opponent ${this.player.opp.name} will be ${data.opponentSymbol}`
  );

  // Store the symbol choices on the player objects
  this.player.symbol = data.playerSymbol;
  this.player.opp.symbol = data.opponentSymbol;

  // Forward the choice to the opponent
  try {
    const oppSocket = io.sockets.sockets.get(this.player.opp.sockid);
    if (oppSocket) {
      oppSocket.emit("symbol_assigned", {
        symbol: data.opponentSymbol,
        opponentSymbol: data.playerSymbol,
        // X always goes first
        yourTurn: data.opponentSymbol === "x",
      });
      console.log(
        `Successfully sent symbol choice to opponent ${this.player.opp.name}`
      );
    } else {
      console.error("Opponent socket not found:", this.player.opp.sockid);
    }
  } catch (error) {
    console.error("Error sending symbol choice to opponent:", error);
  }
}

// ----	--------------------------------------------	--------------------------------------------
// ----	--------------------------------------------	--------------------------------------------

// Add a handler for the play_again event
function onPlayAgain(data) {
  // Make sure we have player info
  if (!this.player) {
    console.error("Cannot reconnect: player not found");
    return;
  }

  console.log(`Player ${this.player.name} wants to play again`);

  // Look for the previous opponent in the players array
  const oppName = data.oppName;
  let opponent = null;

  for (let i = 0; i < players.length; i++) {
    if (players[i].name === oppName && players[i].sockid !== this.id) {
      opponent = players[i];
      break;
    }
  }

  if (!opponent) {
    console.log(`Previous opponent ${oppName} not found or has left the game`);
    // Add player back to available pool for new pairing
    if (!players_avail.includes(this.player)) {
      this.player.status = "looking";
      this.player.opp = null;
      players_avail.push(this.player);
      console.log(`Player ${this.player.name} added back to available pool`);
      // Try to find a new pairing
      pair_avail_players();
    }
    return;
  }

  // Reconnect players if both are available
  if (opponent.status !== "paired") {
    console.log(`Reconnecting ${this.player.name} with ${opponent.name}`);

    // Update player statuses
    this.player.status = "paired";
    opponent.status = "paired";

    // Connect players to each other
    this.player.opp = opponent;
    opponent.opp = this.player;

    // Set player symbols from the request
    this.player.symbol = data.playerSymbol;
    opponent.symbol = data.opponentSymbol;

    // Remove from available pool if present
    const playerIndex = players_avail.indexOf(this.player);
    if (playerIndex !== -1) {
      players_avail.splice(playerIndex, 1);
    }

    const opponentIndex = players_avail.indexOf(opponent);
    if (opponentIndex !== -1) {
      players_avail.splice(opponentIndex, 1);
    }

    // Try to notify the opponent about the reconnection
    try {
      const oppSocket = io.sockets.sockets.get(opponent.sockid);
      if (oppSocket) {
        oppSocket.emit("reconnect_game", {
          opponent: { name: this.player.name, uid: this.player.uid },
          symbol: opponent.symbol,
          opponentSymbol: this.player.symbol,
          yourTurn: opponent.symbol === "x",
        });
        console.log(
          `Successfully notified ${opponent.name} about reconnection`
        );
      } else {
        console.error("Opponent socket not found:", opponent.sockid);
      }
    } catch (error) {
      console.error("Error notifying opponent about reconnection:", error);
    }

    // Send confirmation to this player
    this.emit("reconnect_game", {
      opponent: { name: opponent.name, uid: opponent.uid },
      symbol: this.player.symbol,
      opponentSymbol: opponent.symbol,
      yourTurn: this.player.symbol === "x",
    });
  } else {
    console.log(
      `Opponent ${opponent.name} is already paired with someone else`
    );
  }
}

// ----	--------------------------------------------	--------------------------------------------

// Update the set_game_sock_handlers function to include the new event
set_game_sock_handlers = function (socket) {
  // console.log("New game player has connected: "+socket.id);

  socket.on("new player", onNewPlayer);

  socket.on("ply_turn", onTurn);

  socket.on("symbol_choice", onSymbolChoice);

  socket.on("play_again", onPlayAgain);

  socket.on("disconnect", onClientDisconnect);
};
