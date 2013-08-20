var Socket = require('./lib/socket').Socket;

var express = require('express');
var app = express();
var server = require('http').createServer(app);

var Sessions = require('./lib/session').Sessions;

var sessions = new Sessions(new express.session.MemoryStore());


app.configure(function() {
  app.use(express.cookieParser());
  app.use(express.session({
    store: sessions.store,
    secret: 'n3t810ck6',
    key: 'netBlocks.sid'
  }));

  app.use(express.static(__dirname + '/public'));
});

var io = new Socket(server, sessions);


io.on('new', function(socket) {

  socket.emit('welcome', {
    user: socket.session.user.data()
  });

});

server.listen(80);


// var meta = require('./lib/extra/meta');
// console.log(meta.get(require('./lib/user').User));