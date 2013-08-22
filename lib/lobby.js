'use strict';

var Events = require('./events');
var Users = require('./user').Users;
var net = require('./net');


var Lobby = exports.Lobby = function Lobby(size) {
  this.users = new Users();

  net.add(this, {
    defaults: {
      count: 0,
      size: size || 2
    }
  });
};
net.implement(Lobby, [ 'count', 'size' ]);

Lobby.prototype.join = function join(user) {
  if (!this.users.has(user)) {
    this.users.push(user);
    user.send('lobby.join');

    this.count = this.users.length;
    this.users.send('lobby.state', this.data());

    var self = this;
    user._lobbyDisconnect = function() {
      self.leave(user);
    }
    user.once('disconnect', user._lobbyDisconnect);

    if (this.size == this.count) {
      this.users.send('lobby.end', { players: this.users.length });
      this.emit('ready', this.users, 0);

      this.users.forEach(function(user) {
        user.unbind('disconnect', user._lobbyDisconnect);
      });

      this.users = new Users();
    }
  }
};

Lobby.prototype.leave = function leave(user) {
  this.users.remove(user);
  user.send('lobby.leave');

  this.count = this.users.length;
  this.users.send('lobby.state', this.data());

  this.emit('leave', user);
};
