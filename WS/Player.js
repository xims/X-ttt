/**************************************************
 ** GAME PLAYER CLASS
 **************************************************/
// Import required modules
const crypto = require("crypto");

// Player class definition
var Player = function (uid, name, status) {
  // Generate a random UID if none provided
  this.uid = uid || crypto.randomBytes(8).toString("hex");
  // Set the player's name
  this.name = name;
  // Store the name as username for compatibility with GameMain
  this.username = name;
  // Set player status (looking, paired, etc.)
  this.status = status || "looking";
  // Socket ID to be set later
  this.sockid = "";
  // Opponent reference to be set during pairing
  this.opp = null;
  // Player mode ('m' for master, 's' for slave) - set during pairing
  this.mode = "";

  // Debug log to verify player creation with properties
  console.log(
    `Player created: ${this.name} (username: ${this.username}), uid: ${this.uid}`
  );
};

// Define which variables and methods can be accessed
Player.prototype = {
  getUID: function () {
    return this.uid;
  },
  getName: function () {
    return this.name;
  },
  getUsername: function () {
    return this.username;
  },
  getStatus: function () {
    return this.status;
  },
};

// Export the Player class so you can use it in
// other files by using require("Player").Player
exports.Player = Player;
