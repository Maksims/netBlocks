var Meta = require('./lib/extra/meta');
var User = require('./lib/user').User;

var fs = require('fs');


fs.writeFile('./docs/user.md', Meta.toGitHub(Meta.get(User)), function(err) {
  if (err) {
    console.log(err);
  }
});