'use strict';

var Events = require('./events');
var Meta = require('./extra/meta');


var Collection = exports.Collection = function Collection(key) {
/*
  "description": "Collection that ensures single appearance of item. Define 'key' to enable hashing to speed up searching.",
  "args": {
    "key": {
      "optional": true
    }
  }
*/
  Events.add(this);
  this.list = [ ];
  this.length = 0;

  this.key = key || null;
  this.map = { };
};
Events.implement(Collection);


Collection.prototype.has = function has(fnOrItem) {
/*
  "description": "True if has item or any item satisfies a function."
*/
  if (typeof(fnOrItem) === 'function') {
    for(var i = 0, len = this.list.length; i < len; ++i) {
      if (fnOrItem(this.list[i])) {
        return true;
      }
    }
  } else {
    if (this.key) {
      return this.map[fnOrItem[this.key]] !== undefined;
    } else {
      for(var i = 0, len = this.list.length; i < len; ++i) {
        if (this.list[i] === fnOrItem) {
          return true;
        }
      }
    }
  }
  return false;
};


Collection.prototype.push = function push(item) {
/*
  "description": "Add item if not already in collection."
*/
  if (item instanceof Array) {
    if (this.key) {
      for(var i = 0, len = item.length; i < len; ++i) {
        if (this.map[item[i][this.key]] === undefined) {
          this.list.push(item[i]);
          this.map[item[i][this.key]] = item[i];
          this.emit('added', item[i]);
        }
      }
    } else {
      for(var n = 0, lenP = item.length; n < lenP; n++) {
        for(var i = 0, len = this.list.length; i < len; ++i) {
          if (this.list[i] !== item) {
            this.list.push(item[n]);
            this.emit('added', item[n]);
          }
        }
      }
    }
  } else {
    if (this.key) {
      if (this.map[item[this.key]] !== undefined) {
        return;
      }
      this.list.push(item);
      this.map[item[this.key]] = item;
      this.emit('added', item);
    } else {
      for(var i = 0, len = this.list.length; i < len; ++i) {
        if (this.list[i] === item) {
          return;
        }
      }
      this.list.push(item);
      this.emit('added', item);
    }
  }
  this.length = this.list.length;
};


Collection.prototype.pull = function pull(fnOrKey) {
/*
  "description": "Removes item and returns it by key or function."
*/
  if (typeof(fnOrKey) === 'function') {
    for(var i = 0, len = this.list.length; i < len; ++i) {
      var item = this.list[i];
      if (fnOrKey(item)) {
        if (this.key) {
          delete this.map[item[this.key]];
        }
        this.list.splice(i, 1);
        this.length = this.list.length;
        this.emit('removed', item);
        return item;
      }
    }
  } else {
    if (this.key && this.map[fnOrKey] !== undefined) {
      var item = this.map[fnOrKey];
      for(var i = 0, len = this.list.length; i < len; ++i) {
        if (this.list[i] === item) {
          this.list.splice(i, 1);
          this.length = this.list.length;
          delete this.map[fnOrKey];
          this.emit('removed', item);
          return item;
        }
      }
    }
  }
  return null;
};


Collection.prototype.remove = function remove(fnOrItem) {
/*
  "description": "Removes items by function or item."
*/
  if (typeof fnOrItem === 'function') {
    var i = this.list.length;
    while(i--) {
      var item = this.list[i];
      if(fnOrItem(item)) {
        if (this.key) {
          delete this.map[item[this.key]];
        }
        this.list.splice(i, 1);
        this.length = this.list.length;
        this.emit('removed', item);
      }
    }
  } else {
    for(var i = 0, len = this.list.length; i < len; ++i) {
      var item = this.list[i];
      if (item === fnOrItem) {
        if (this.key) {
          delete this.map[item[this.key]];
        }
        this.list.splice(i, 1);
        this.length = this.list.length;
        this.emit('removed', item);
        return true;
      }
    }
  }
  return false;
};


Collection.prototype.toArray = function toArray(fn) {
/*
  "description": "Returns array with items, optionally filtered by a function.",
  "args": {
    "fn": {
      "optional": true
    }
  }
*/

  if (fn) {
    return this.list.filter(fn);
  } else {
    var res = [ ];
    for(var i = 0, len = this.list.length; i < len; ++i) {
      res.push(this.list[i]);
    }
    return res;
  }
};


Collection.prototype.clear = function() {
/*
  "description": "Removes all items."
*/
  var i = this.list.length;
  while(i--) {
    var item = this.list[i];
    if (this.key) {
      delete this.map[item[this.key]];
    }
    this.list.splice(i, 1);
    this.length = this.list.length;
    this.emit('removed', item);
  }
};


Collection.prototype.get = function get(fnOrKey) {
/*
  "description": "Returns item satisfying function or by key."
*/
  if (typeof(fnOrKey) === 'function') {
    for(var i = 0, len = this.list.length; i < len; ++i) {
      if (fnOrKey(this.list[i])) {
        return this.list[i];
      }
    }
  } else {
    if (this.key && this.map[fnOrKey] !== undefined) {
      return this.map[fnOrKey];
    }
  }
  return null;
};


Collection.prototype.forEach = function forEach(fn) {
/*
  "description": "Call function for each item."
*/
  for(var i = 0, len = this.list.length; i < len; ++i) {
    fn(this.list[i]);
  }
};