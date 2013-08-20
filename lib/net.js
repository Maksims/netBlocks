var Events = require('./events');

function NObject(id, defaults) {
  Events.add(this);

  this.id = id;
  this._properties = [ 'id' ];
  this._updateList = [ ];
  this._updateMap = { };

  if (this._properties.length > 1) {
    for(var i = 1, len = this._properties.length; i < len; ++i) {
      this._updateList.push(this._properties[i]);
      this._updateMap[this._properties[i]] = true;

      this['_' + this._properties[i]] = defaults[this._properties[i]] || null;
    }
  }

  this._updatedData = true;
  this._cacheData = null;

  this._updatedDelta = true;
  this._revDelta = 0;
  this._cacheDelta = null;
};
Events.implement(NObject);

NObject.prototype.data = function() {
  if (this._updatedData) {
    this._updatedData = false;
    this._cacheData = { };

    for (var i = 0, len = this._properties.length; i < len; ++i) {
      this._cacheData[this._properties[i]] = this[this._properties[i]];
    }

    return this._cacheData;
  } else {
    return this._cacheData;
  }
};

NObject.prototype.delta = function(rev) {
  if (this._updatedDelta) {
    this._updatedDelta = false;
    this._revDelta = rev;

    if (this._updateList.length > 0) {
      this._cacheDelta = {
        id: this.id
      };
      for(var i = 0, len = this._updateList.length; i < len; ++i) {
        this._cacheDelta[this._updateList[i]] = this[this._updateList[i]];
      }

      this._updateList = [ ];
      this._updateMap = { };

      return this._cacheDelta;
    } else {
      this._cacheDelta = null;
      return null;
    }
  } else if (this._revDelta == rev) {
    return this._cacheDelta;
  } else {
    return null;
  }
};



exports.add = function(obj, data) {
  NObject.call(obj, data.id, data.defaults || { });
}

exports.implement = function(fn, fields) {
  fn.prototype = Object.create(NObject.prototype);

  for(var i = 0, len = fields.length; i < len; ++i) {
    defineField(fn, fields[i]);
  }
}



function defineField(fn, name) {
  Object.defineProperty(fn.prototype, name, {
    get: function() {
      return this['_' + name];
    },
    set: function(value) {
      if (this['_' + name] !== value) {
        this['_' + name] = value;

        if (!this._updateMap[name]) {
          this._updateMap[name] = true;
          this._updateList.push(name);
          this._updatedData = true;
          this._updatedDelta = true;
        }
        this.emit('.' + name, this[name]);
        this.emit('change', name);
      }
    }
  });

  if (fn.prototype._properties) {
    fn.prototype._properties.push(name);
  } else {
    Object.defineProperty(fn.prototype, '_properties', {
      value: [ 'id', name ]
    });
  }
}