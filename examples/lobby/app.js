var express = require('express');
var app     = express();
var server  = require('http').createServer(app);
var Socket  = require('../../lib/socket').Socket;

// static files
app.configure(function() {
  app.use(express.static(__dirname + '/public'));
});


// socket server
var io = new Socket(server);

var Lobby = require('../../lib/lobby').Lobby;



// create lobby for 4 players
var lobby = new Lobby(4);

// when someone joins the lobby, send message back with join
lobby.on('join', function(user) {
  user.send('lobby.join');
});

// when lobby is full, send to all ready users message
lobby.on('ready', function(users) {
  users.send('lobby.end', { players: users.length });
});

// when lobby .count is changed or someone left, send lobby state to its users
lobby.on([ '.count', 'leave' ], function() {
  this.users.send('lobby.state', this.data());
});

// when user left the lobby, send him a message
lobby.on('leave', function(user) {
  user.send('lobby.leave');
});


// when client connected
io.on('new', function(socket) {

  // when client requests to join in lobby
  socket.on('lobby.join', function() {
    lobby.join(this.session.user);
  });

  // when client requests to leave from lobby
  socket.on('lobby.leave', function() {
    lobby.leave(this.session.user);
  });

});


// start server on port 9001
server.listen(9001);
console.log('started');