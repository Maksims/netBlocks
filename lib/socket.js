var socketIO = require('socket.io');
var cookie = require('cookie');
var Events = require('./events');

var User = require('./user').User;


var Socket = exports.Socket = function Socket(server, sessions) {
  Events.add(this);

  this.connections = 0;
  this.io = socketIO.listen(server, {
    log: false
  });
  this.io.set('heartbeat timeout', 15);
  this.io.set('heartbeat interval', 5);
  this.io.set('close timeout', 15);
  this.io.set('transports', [
    'websocket'
  , 'xhr-polling'
  , 'jsonp-polling'
  ]);

  if (sessions) {
    this._authorization(sessions);
  }
  this._listen(sessions);
};
Events.implement(Socket);


Socket.prototype._authorization = function _authorization(sessions) {
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
};

Socket.prototype._listen = function _listen(sessions) {
  var self = this;

  this.io.sockets.on('connection', function(socket) {
    self.connections++;

    if (sessions) {
      socket.session = sessions.get(socket);
    } else {
      socket.session = { };
    }

    if (socket.session) {
      if (!socket.session.user) {
        socket.session.user = new User(socket);
        socket.session.user.on('timeout', function() {
          if (this.idle && socket.session) {
            socket.session.user = null;
          }
        });
      } else {
        socket.session.user._restore(socket);
      }

      socket.on('disconnect', function() {
        self.connections--;
      });

      self.emit('new', socket);
    } else {
      socket.emit('disconnect');
      socket.disconnect();
      self.connections--;
    }
  });
}