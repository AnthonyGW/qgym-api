#!/usr/local/bin/node

var fs = require('fs');
var testConfigFilePath = require('path').resolve(__dirname, '../config/test.json');
var testConfigFile = require(testConfigFilePath);
var prodConfigFilePath = require('path').resolve(__dirname, '../config/production.json');
var prodConfigFile = require(prodConfigFilePath);

testConfigFile.DBURL = '';
testConfigFile.PORT = '';
testConfigFile.SESSION_SECRET = '';
testConfigFile.APP_SOURCE = '';
prodConfigFile.DBURL = '';
prodConfigFile.PORT = '';
prodConfigFile.SESSION_SECRET = '';
prodConfigFile.APP_SOURCE = '';

fs.writeFile(testConfigFilePath, JSON.stringify(testConfigFile, null, 2), function (err) {
  console.log(JSON.stringify(testConfigFile));
  if (err) return console.log(err);
  console.log('Clearing values in ' + testConfigFilePath);
});

fs.writeFile(prodConfigFilePath, JSON.stringify(prodConfigFile, null, 2), function (err) {
  console.log(JSON.stringify(prodConfigFile));
  if (err) return console.log(err);
  console.log('Clearing values in ' + prodConfigFilePath);
});
