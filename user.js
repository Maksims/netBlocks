'use strict';

var Events = require('./events');


var User = exports.User = function User(socket, data) {
  Events.add(this);

  this.id = data.id;
  this.name = data.name;
  this.socket = null;
  this.idle = true;
  this.timeout = null;

  this._setSocket(socket);

  var self = this;
  this.on('timeout', function() {
    self.emit('disconnect');
  });
};
Events.implement(User);

User.prototype._setSocket = function _setSocket(socket) {
  if (!this.socket) {
    this.socket = socket;
    this.idle = false;

    var self = this;
    this.socket.on('disconnect', function() {
      self.socket = null;
      self.idle = true;
      self.timeout = self.delay('timeout', 2000);
      self.emit('idle');
    });

    return true;
  }
};

User.prototype.restore = function restore(socket) {
  if (this._setSocket(socket)) {
    this.timeout.cancel();
    this.emit('restored');
  }
};

User.prototype.send = function send(name, data) {
  if (this.socket) {
    this.socket.emit(name, data);
  }
};
