var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');


/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  var url = this.paths.list;
  fs.readFile(url, 'utf8', function(error, data) {
    var dataToArray = data.split('\n');
    callback(dataToArray);
  });
};

exports.isUrlInList = function(url, callback) {
  var urlForFile = this.paths.list;
  fs.readFile(urlForFile, 'utf8', function(error, data) {
    var exists = false;
    data.indexOf(url) !== -1 ? exists = true : 0;
    callback(exists);
  });
};

exports.addUrlToList = function(url, callback) {
  var urlForFile = this.paths.list;
  fs.readFile(urlForFile, 'utf8', function(err, data) {  
    data += url + '\n';
    fs.writeFile(urlForFile, data);
    callback(url);
  });
};

exports.isUrlArchived = function(url, callback) {
  var urlForFile = this.paths.archivedSites;
  fs.readdir(urlForFile, function(error, files) {
    var exists = false;
    files.indexOf(url) !== -1 ? exists = true : 0;
    callback(exists);
  });
};

exports.downloadUrls = function(urlOfArray) {
  var context = this.paths.archivedSites;
  urlOfArray.forEach(function(url) {
    return http.get({
      host: url
    }, function(response) {
      var body = '';
      response.on('data', function(d) {
        body += d;
      });
      response.on('end', function() {
        var urlToWrite = context + '/' + url;
        console.log(urlToWrite);
        console.log(url);
        fs.writeFile(urlToWrite, body);
      });
    });
  });
 
};


 
