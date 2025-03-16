// Setup basic express server
var express = require("express");
var cluster = require("cluster");
var numCPUs = require("os").cpus().length;

// Implement clustering for better performance
if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // IMPORTANT: For simplicity in this game, we'll use only ONE worker
  // This avoids issues with players being in separate worker processes
  // A proper solution would use Redis or another shared data store for players
  const workerCount = 1; // Limit to 1 worker to avoid player pairing issues

  console.log(`Starting ${workerCount} worker(s)...`);
  for (let i = 0; i < workerCount; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
} else {
  // Workers share the TCP connection
  var app = express();
  var server = require("http").createServer(app);

  // Configure Socket.io with appropriate options
  io = require("socket.io")(server, {
    // Remove adapter for single worker setup
    // adapter: require("socket.io-adapter-cluster")(),
    // Configure CORS to allow connections from any origin
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["content-type"],
      credentials: true,
    },
    // Connection timeout in milliseconds
    connectTimeout: 15000,
    // Transport configurations
    transports: ["websocket", "polling"],
  });

  var path = require("path");

  // Utility resources, but no longer using util.log - it's deprecated
  var util = require("util");

  /**************************************************
   ** GAME VARIABLES
   **************************************************/
  Player = require("./Player").Player; // Player class
  players = []; // Array of connected players
  players_avail = [];

  var port = process.env.PORT || 3001;

  server.listen(port, function () {
    console.log(`Worker ${process.pid} listening at port ${port}`);
  });

  // Routing
  app.use(
    express.static(__dirname + "/public", {
      setHeaders: (res, path) => {
        if (path.endsWith(".css")) {
          res.setHeader("Content-Type", "text/css");
        }
        if (path.endsWith(".js")) {
          res.setHeader("Content-Type", "application/javascript");
        }
      },
    })
  );

  // Add this wildcard route handler to serve index.html for all other routes
  // This is needed for client-side routing to work properly
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  });

  // Load game handlers
  require("./XtttGame.js");

  // Socket.io connection handler
  io.on("connection", function (socket) {
    console.log(`New socket connection established: ${socket.id}`);
    set_game_sock_handlers(socket);
  });

  console.log(`Worker ${process.pid} started`);
}
