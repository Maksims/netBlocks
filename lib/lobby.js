'use strict';

var Events = require('./events');
var Collection = require('./collection').Collection;


var Lobby = exports.Lobby = function Lobby(limit) {
  Events.add(this);
  this.users = new Collection('id');
  this.count = 0;
  this.limit = this.limit || 2;
};
Events.implement(Lobby);

Lobby.prototype.join = function join(user) {
  this.users.push(user);
  this.count = this.users.length;

  var self = this;
  user.on('disconnect', function() {
    self.leave(this);
  });

  if (this.limit == this.count) {
    this.emit('ready', this.users);
    this.users = new Collection();
    this.count = 0;
  }
};

Lobby.prototype.leave = function leave(user) {
  this.users.remove(user);
  this.count = this.users.length;
};
