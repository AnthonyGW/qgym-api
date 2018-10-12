#!/usr/local/bin/node

var fs = require('fs');
var fileName = require('path').resolve(__dirname, '../config/test.json');
var file = require(fileName);

file.PORT = process.env.TEST_PORT || 3030;
file.SESSION_SECRET = process.env.TEST_SESSION_SECRET || 'cool-express-app';

fs.writeFile(fileName, JSON.stringify(file, null, 2), function (err) {
  console.log(JSON.stringify(file));
  if (err) return console.log(err);
  console.log('Writing env variables to ' + fileName);
});
