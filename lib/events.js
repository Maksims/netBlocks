'use strict';

var Events = exports.Events = function Events() {
  this.events = { };
}

Events.prototype.on = function on(name, fn) {
  var events = this.events[name];
  if (events == undefined) {
    this.events[name] = [ fn ];
  } else {
    if (events.indexOf(fn) == -1) {
      events.push(fn);
    }
  }
  return this;
};

Events.prototype.once = function once(name, fn) {
  var events = this.events[name];
  fn.once = true;
  if (!events) {
    this.events[name] = [ fn ];
  } else {
    if (events.indexOf(fn) == -1) {
      events.push(fn);
    }
  }
  return this;
};

Events.prototype.emit = function emit(name, args) {
  var events = this.events[name];
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
};

Events.prototype.delay = function delay(name, args, delay) {
  var self = this;
  if (!delay) {
    delay = args;
  }
  return new DelayedEvent(function() {
    self.emit(name, args);
  }, delay);
};

Events.prototype.unbind = function unbind(name, fn) {
  if (name) {
    var events = this.events[name];
    if (events) {
      if (fn) {
        var i = events.indexOf(fn);
        if (i != -1) {
          delete events[i];
        }
      } else {
        delete this.events[name];
      }
    }
  } else {
    delete this.events;
    this.events = { };
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
  obj.events = { };
};
exports.implement = function implement(fn) {
  fn.prototype = Object.create(Events.prototype);
};
