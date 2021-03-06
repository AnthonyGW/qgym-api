#!/usr/local/bin/node

var fs = require('fs');
var testConfigFilePath = require('path').resolve(__dirname, '../config/test.json');
var testConfigFile = require(testConfigFilePath);
var prodConfigFilePath = require('path').resolve(__dirname, '../config/production.json');
var prodConfigFile = require(prodConfigFilePath);

testConfigFile.DBURL = process.env.TEST_DBURL || 'mongodb://localhost:27017/test';
testConfigFile.PORT = process.env.TEST_PORT || 3030;
testConfigFile.SESSION_SECRET = process.env.TEST_SESSION_SECRET || 'cool-express-app';
prodConfigFile.DBURL = process.env.DBURL || 'mongodb://localhost:27017/dev';
prodConfigFile.PORT = process.env.PORT || 3030;
prodConfigFile.SESSION_SECRET = process.env.SESSION_SECRET || 'coolest-express-app';
prodConfigFile.APP_SOURCE = process.env.APP_SOURCE || 'http://localhost:4200';

fs.writeFile(testConfigFilePath, JSON.stringify(testConfigFile, null, 2), function (err) {
  console.log(JSON.stringify(testConfigFile));
  if (err) return console.log(err);
  console.log('Writing env variables to ' + testConfigFilePath);
});

fs.writeFile(prodConfigFilePath, JSON.stringify(prodConfigFile, null, 2), function (err) {
  console.log(JSON.stringify(prodConfigFile));
  if (err) return console.log(err);
  console.log('Writing env variables to ' + prodConfigFilePath);
});
