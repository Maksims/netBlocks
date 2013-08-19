exports.get = function get(fn) {
  try {
    var meta = {
      name: fn.name
    };

    var self = parseFunction(fn);
    if (self) {
      for(var key in self) {
        meta[key] = self[key];
      }
    } else {
      meta.name = '*parseError*';
    }

    meta.methods = [ ];

    for(var name in fn.prototype) {
      if (name[0] !== '_') {
        var obj = {
          name: name
        };
        var data = parseFunction(fn.prototype[name]);
        if (data) {
          for(var key in data) {
            obj[key] = data[key];
          }
          meta.methods.push(obj);
        }
      }
    }

    meta.methods.sort(function(a, b) {
      if (a.name > b.name) {
        return 1;
      } else if (a.name < b.name) {
        return -1;
      } else {
        return 0;
      }
    });

    return meta;
  } catch(ex) {
    console.log(ex);
    return null;
  }
}

exports.toGitHub = function(meta) {
  var res = '';

  res += '# ' + meta.name + ' (';

  if (meta.args) {
    res +=' ';

    var first = true;
    for(var name in meta.args) {
      if (first) {
        first = false;
      } else {
        res += ', ';
      }
      if (meta.args[name].optional) {
        res += '[' + name + ']';
      } else {
        res += name;
      }
    }
  }
  res += ' )';

  if (meta.description) {
    res += '\n' + meta.description + '\n';
  }

  res += '\n---\n\n';
  res += '## Methods:\n'

  for(var i = 0, len = meta.methods.length; i < len; ++i) {
    var method = meta.methods[i];
    res += '* **' + method.name + '** *(';

    if (method.args) {
      res +=' ';

      var first = true;
      for(var name in method.args) {
        if (first) {
          first = false;
        } else {
          res += ', ';
        }
        if (method.args[name].optional) {
          res += '[' + name + ']';
        } else {
          res += name;
        }
      }
    }
    res += ' )*  \n';

    if (method.description) {
      res += '  ' + method.description + '\n';
    }
    res += '  \n';
  }

  return res;
}

function parseFunction(fn) {
  var raw = fn.toString().replace(/\r?\n/g, '');
  var args = raw.match(new RegExp('^function[a-zA-Z_ ]*\\(([a-zA-Z_, ]*)\\) *{ *(/\\*[^*/]*\\*/)?'));
  if (args) {
    var obj = { };
    var arguments = args[1].trim().split(/, */g);
    if (!(arguments.length === 1 && arguments[0] === '')) {
      obj.args = { };
      for(var i = 0, len = arguments.length; i < len; ++i) {
        obj.args[arguments[i]] = { };
      }
    }

    if (args[2] !== undefined) {
      try {
        var comments = JSON.parse(args[2].replace('/*', '{').replace('*/', '}'));
        for(var key in comments) {
          if (obj[key] === undefined) {
            if (typeof(comments[key]) === 'string') {
              comments[key] = comments[key].trim();
            }
            obj[key] = comments[key];
          } else if (key == 'args') {
            if (obj.args && typeof(comments[key]) === 'object') {
              for(var arg in comments[key]) {
                if (obj.args[arg] !== undefined) {
                  obj.args[arg] = comments[key][arg];
                }
              }
            }
          }
        }
      } catch(ex) {
        console.log(ex, ex.stack)
        obj.error = '*parseError*';
      }
    }

    return obj;
  } else {
    console.log(fn.toString());
  }
}
