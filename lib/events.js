'use strict';

var Events = exports.Events = function Events() {
  this._events = { };
}

Events.prototype.on = function on(names, fn) {
  if (!(names instanceof Array)) {
    names = [ names ];
  }
  for(var i = 0, len = names.length; i < len; ++i) {
    var events = this._events[names[i]];
    if (events == undefined) {
      this._events[names[i]] = [ fn ];
    } else {
      if (events.indexOf(fn) == -1) {
        events.push(fn);
      }
    }
  }
  return this;
};

Events.prototype.once = function once(name, fn) {
  var events = this._events[name];
  fn.once = true;
  if (!events) {
    this._events[name] = [ fn ];
  } else {
    if (events.indexOf(fn) == -1) {
      events.push(fn);
    }
  }
  return this;
};

Events.prototype.emit = function emit(name, args, delay) {
  if (delay) {
    var self = this;
    return new DelayedEvent(function() {
      self.emit(name, args);
    }, delay);
  } else {
    var events = this._events[name];
    if (events) {
      var i = events.length;
      while(i--) {
        if (events[i]) {
          events[i].call(this, args);
          if (events[i].once) {
            delete events[i];
          }
        }
      }
    }
    return this;
  }
};

Events.prototype.unbind = function unbind(name, fn) {
  if (name) {
    var events = this._events[name];
    if (events) {
      if (fn) {
        var i = events.indexOf(fn);
        if (i != -1) {
          delete events[i];
        }
      } else {
        delete this._events[name];
      }
    }
  } else {
    delete this._events;
    this._events = { };
  }
  return this;
};



function DelayedEvent(fn, delay) {
  this.timeout = setTimeout(fn, delay);
};

DelayedEvent.prototype.cancel = function cancel() {
  if (this.timeout) {
    clearTimeout(this.timeout);
    this.timeout = null;
  }
};


exports.add = function add(obj) {
  Events.call(obj);
};
exports.implement = function implement(fn) {
  fn.prototype = Object.create(Events.prototype);
};
