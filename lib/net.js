var socketIO = require('socket.io');
var cookie = require('cookie');
var Events = require('./events');


var Net = exports.Net = function Net(server, sessions) {
  Events.add(this);

  this.connections = 0;
  this.io = socketIO.listen(server, {
    log: false
  });

  var self = this;

  this.io.set('authorization', function(data, accept) {
    if (data.headers.cookie) {
      var cookies = cookie.parse(data.headers.cookie);
      if (cookies['netBlocks.sid'] !== undefined) {
        data.sessionId = cookies['netBlocks.sid'].split('.')[0].split(':')[1];
        sessions.restore(data.sessionId, function(err, restored) {
          if (!err) {
            accept(null, true);
          } else {
            accept(err, false);
          }
        });
      } else {
        accept('session cookie is missing', false);
      }
    }
  });

  this.io.sockets.on('connection', function(socket) {
    self.connections++;

    // single use middleware that will be ran in initialization to restore the session
    socket.middleware = function(name, data) {
      this.middleware = null;
      this.session = this.session || sessions.get(this);
      if (this.session) {
        return true;
      } else {
        socket.emit('disconnect');
        socket.disconnect();
      }
    }

    socket.on('disconnect', function() {
      self.connections--;
    });

    self.emit('new', socket);
  });
}
Events.implement(Net);



function Socket(socket) {
  Events.add(this);

  this.id = socket.id;
  this.raw = socket;
  this.session = null;
}
Events.implement(Socket);

Socket.prototype.send = function(name, data) {
  this.raw.emit(name, data);
}