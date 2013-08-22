'use strict';

var Events = require('./events');
var net = require('./net');
var Collection = require('./collection').Collection;
var NObject = net.NObject;

var guests = 0;


var User = exports.User = function User(socket, data) {
  data      = data      || { };
  data.id   = data.id   || 'g' + ++guests;
  data.name = data.name || 'guest';

  net.add(this, {
    id: data.id,
    defaults: {
      name: data.name
    }
  });

  this._socket = null;
  this._setSocket(socket);
};
net.implement(User, [ 'name' ]);


User.prototype._setSocket = function _setSocket(socket) {
  if (!this._socket) {
    this._socket = socket;
    // this.idle = false;

    var self = this;
    this._socket.on('disconnect', function() {
      self._socket = null;
      self.emit('disconnect');
    });

    return true;
  }
};

User.prototype.send = function send(name, data) {
  if (this._socket) {
    this._socket.emit(name, data);
  }
};



var Users = exports.Users = function Users() {
  Collection.call(this, 'id');
}
Users.prototype = Object.create(Collection.prototype);

Users.prototype.send = function send(name, data) {
  if (this.list.length > 0) {
    this.list.forEach(function(user) {
      user.send(name, data)
    });
  }
};