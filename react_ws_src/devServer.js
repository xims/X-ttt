//externals
var path = require('path')
var express = require('express')
var webpack = require('webpack')
var webpackDevMiddleware = require('webpack-dev-middleware')
var proxy = require('proxy-middleware')
var url = require('url')

// local webpack dev config
var config = require('./webpack.config.dev')

// express vars
var app = express()
var compiler = webpack(config)
var port = process.env.PORT || 3000

app.use(
    webpackDevMiddleware(compiler, {
        noInfo: true,
        publicPath: config.output.publicPath,
    })
)

// handle any route to send index.html response
app.get('*', function (res) {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.listen(port, function (err) {
    if (err) {
        console.log(err)
        return
    }
    console.log('Listening on: ' + port)
})
