var Collection = require('./collection').Collection;


var TIMEOUT         = 1000 * 60 * 3;
var TIMEOUT_CHECK   = 1000 * 15;


var Sessions = exports.Sessions = function Sessions(store) {
  Collection.call(this, 'id');
  this.parent = Collection.prototype;

  this.store = store;

  var self = this;
  setInterval(function() {
    self._clear();
  }, TIMEOUT_CHECK);
}
Sessions.prototype = Object.create(Collection.prototype);
Sessions.prototype.constructor = Sessions;


Sessions.prototype.push = function(id) {
  this.parent.push.call(this, new Session(id));
}

Sessions.prototype.restore = function(id, fn) {
  var self = this;
  this.store.get(id, function(err, session) {
    if (!err && session) {
      self.push(id);
      fn(null, true);
    } else {
      fn('error restoring session', false);
    }
  });
}

Sessions.prototype.get = function(socket) {
  var session = this.parent.get.call(this, socket.handshake.sessionId);
  if (session) {
    session.activity = Date.now();
  }
  return session;
}

Sessions.prototype._clear = function() {
  this.remove(function(session) {
    if (Date.now() - session.activity > TIMEOUT) {
      return true;
    }
  });
}



function Session(id) {
  this.id = id;
  this.activity = Date.now();
}