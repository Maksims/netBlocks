'use strict';

var Events = require('./events');
var net = require('./net');
var NObject = net.NObject;

var TIMEOUT = 1000 * 60; // 60s

var guests = 0;


var User = exports.User = function User(socket, data) {
  data      = data      || { };
  data.id   = data.id   || 'g' + ++guests;
  data.name = data.name || 'guest';

  net.add(this, {
    id: data.id,
    defaults: {
      name: data.name,
      idle: false
    }
  });

  this._socket = null;
  this._timeout = null;

  this._setSocket(socket);

  var self = this;
  this.on('timeout', function() {
    self.emit('disconnect');
  });
};
net.implement(User, [ 'name', 'idle' ]);


User.prototype._setSocket = function _setSocket(socket) {
  if (!this._socket) {
    this._socket = socket;
    this.idle = false;

    var self = this;
    this._socket.on('disconnect', function() {
      self._socket = null;
      self.idle = true;
      self._timeout = self.emit('timeout', null, TIMEOUT);
      self.emit('idle');
    });

    return true;
  }
};

User.prototype._restore = function _restore(socket) {
  if (this._setSocket(socket)) {
    this._timeout.cancel();
    this.emit('restored');
  }
};

User.prototype.send = function send(name, data) {
  if (this._socket) {
    this._socket.emit(name, data);
  }
};