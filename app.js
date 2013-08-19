var Net = require('./lib/net').Net;

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

var io = new Net(server, sessions);


io.on('new', function(socket) {
  socket.on('test', function() {

  });

  socket.on('disconnect', function() {

  });
});



server.listen(80);