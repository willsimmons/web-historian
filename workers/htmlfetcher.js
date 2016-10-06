// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var url = require('url');
var headers = require('../web/http-helpers').headers;


exports.htmlfetcher = function() {
  var url = archive.paths.list;
  console.log('inside the htmlfetcherfdsgdsfgdfsdsafasdf');
  fs.readFile(url, 'utf8', function(error, data) {
    var dataToArray = data.split('\n');
    dataToArray.pop();
    console.log(dataToArray);
    archive.downloadUrls(dataToArray);
  });
};