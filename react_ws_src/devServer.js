const path = require("path");
const express = require("express");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");
const proxy = require("express-http-proxy");
const config = require("./webpack.config.dev");

const app = express();
const compiler = webpack(config);
const PORT = 3001;

// Webpack middleware
app.use(
  webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
  })
);

app.use(webpackHotMiddleware(compiler));

// Static files middleware
app.use("/static", express.static(path.join(__dirname, "static")));

// Also serve style.css and bundle.js from the root
app.use("/static/style.css", (req, res) => {
  res.setHeader("Content-Type", "text/css");
  res.sendFile(path.join(__dirname, "static", "style.css"));
});

app.use("/static/bundle.js", (req, res, next) => {
  res.setHeader("Content-Type", "application/javascript");
  // Let webpack middleware handle this if it exists
  if (res.headersSent) return next();
  next();
});

// Proxy middleware for images
app.use(
  "/images",
  proxy("http://z2/projs/kisla/X-react-starter/dev/WS", {
    proxyReqPathResolver: function (req) {
      return "/images" + req.url;
    },
  })
);

// Serve index.html for all other routes (SPA support)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, "localhost", (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(`Listening at http://localhost:${PORT}`);
});
