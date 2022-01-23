// externals
var express = require('express')
var app = express()
var server = require('http').createServer(app)
var path = require('path')

io = require('socket.io')(server)
util = require('util') // Utility resources (logging, object inspection, etc)

// local req
var game = require('./src/XtttGame.js')

// allocate port
var port = process.env.PORT || 3001

server.listen(port, function (err) {
    if (err) console.log(err)
    console.log('Server listening at http://localhost:' + port)
})

// Routing
app.use(express.static(__dirname + '/public'))

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'))
})

// handle game socket events
io.on('connection', game.set_game_sock_handlers)
