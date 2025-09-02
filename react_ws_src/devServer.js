var path = require('path');
var express = require('express');
var compression = require('compression');
var webpack = require('webpack');
var config = require('./webpack.config.dev');

var app = express();
var compiler = webpack(config);

// Cache configuration constants
var CACHE_DURATION = {
	JS_CSS_SECONDS: 31536000,    // 1 year
	ASSETS_SECONDS: 2592000      // 30 days 
};

// add gzip compression to improve total time blocking
app.use(compression());

app.use(function(req, res, next) {
	// set cache headers for JavaScript and CSS files to improve total time blocking
	if (req.url.match(/\.(js|css)$/)) {
		var maxAge = CACHE_DURATION.JS_CSS_SECONDS;
		res.setHeader('Cache-Control', 'public, max-age=' + maxAge);
		res.setHeader('Expires', new Date(Date.now() + (maxAge * 1000)).toUTCString());
	}
	// set cache headers for images and other static assets to improve total time blocking
	else if (req.url.match(/\.(png|jpg|jpeg|gif|ico|svg|xml)$/)) {
		var maxAge = CACHE_DURATION.ASSETS_SECONDS;
		res.setHeader('Cache-Control', 'public, max-age=' + maxAge);
		res.setHeader('Expires', new Date(Date.now() + (maxAge * 1000)).toUTCString());
	}
	next();
});

app.use(require('webpack-dev-middleware')(compiler, {
	noInfo: true,
	publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

// app.use(express.static(paths.client('images')))
// app.use(express.static('static'))

var proxy = require('proxy-middleware');
var url = require('url');
// app.use('/images', proxy(url.parse('../WS/images')));
// app.use('/img', proxy(url.parse('../WS/img')));
app.use('/images', proxy(url.parse('http://z2/projs/kisla/X-react-starter/dev/WS/images')));

app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname, 'static', 'index.html'));
});

app.listen(3000, '0.0.0.0', function(err) {
	if (err) {
		console.log(err);
		return;
	}
	console.log('Listening at http://0.0.0.0:3000');
});
