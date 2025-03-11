// Setup basic express server
var express = require("express");
var cluster = require("cluster");
var numCPUs = require("os").cpus().length;

// Implement clustering for better performance
if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers based on CPU count (but limit to a reasonable number)
  const workerCount = Math.min(numCPUs, 4);

  console.log(`Starting ${workerCount} workers...`);
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
  io = require("socket.io")(server, {
    // Add adapter for multi-process synchronization
    adapter: require("socket.io-adapter-cluster")(),
  });
  var path = require("path");

  util = require("util"); // Utility resources (logging, object inspection, etc)

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

  require("./XtttGame.js");

  io.on("connection", set_game_sock_handlers);

  console.log(`Worker ${process.pid} started`);
}
