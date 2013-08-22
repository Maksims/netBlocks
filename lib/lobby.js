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
    this.emit('join', user);

    this.count = this.users.length;

    var self = this;
    user.on([ 'disconnect' ], function() {
      self.leave(user);
    });

    if (this.size == this.count) {
      this.emit('ready', this.users, 0);
      this.users = new Users();
    }
  }
};

Lobby.prototype.leave = function leave(user) {
  this.users.remove(user);
  this.count = this.users.length;
  this.emit('leave', user);
};
