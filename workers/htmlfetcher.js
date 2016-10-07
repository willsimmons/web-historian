// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var url = require('url');
var headers = require('../web/http-helpers').headers;


var url = archive.paths.list;
fs.readFile(url, 'utf8', function(error, data) {
  var dataToArray = data.split('\n');
  dataToArray.pop();
  archive.downloadUrls(dataToArray);
  fs.writeFile(archive.paths.list, '');
});

//cronjob code
//* * * * * /usr/local/bin/node /Users/student/Desktop/2016-09-web-historian/workers/htmlfetcher.js