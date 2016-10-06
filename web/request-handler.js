var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var url = require('url');
var headers = require('../web/http-helpers').headers;
// require more modules/folders here!

var indexServer = function(req, res) {
  var fileName = './web/public/index.html';
  fs.readFile(fileName, 'utf8', function(error, data) {
    res.end(data);
  });
};

var otherAssets = function(req, res) {
  var fileName = './web/public' + req.url;
  fs.readFile(fileName, 'utf8', function(error, data) {
    res.end(data);
  });
};

var handlePost = function(req, res) {
  var url;
  var urlsData;
  var memory;
  res.writeHead(302);
  req.on('data', function(chunk) {
    
    urlsData = chunk.toString();
    memory = urlsData.slice(4);
    
  });
  
  
  fs.readFile(archive.paths.list, 'utf8', function(err, data) {
    console.log('before', data);

    if (data.indexOf(memory) > 0) {
      
    } else {
      data += memory;
      fs.writeFile(archive.paths.list, data);
     
      res.end();
    }
  });
  
};


var siteFinder = function(req, res) {
  var url = archive.paths.archivedSites + '/' + req.url;
  fs.exists(url, function(e) {
    if (!e) {
      res.writeHead(404);
      res.end();
    } else {
      fs.readFile(url, 'utf8', function(error, data) {
        res.end(data);
      });
    }
  });
};

exports.handleRequest = function (req, res) {
  // var parser = document.createElement('a');
  var statusCode = 200;
  // parser.href = req.url;
  if (req.url === '/' && req.method === 'GET') {
    headers['Content-Type'] = 'text/html';
    res.writeHead(statusCode, headers);
    indexServer(req, res);
  } else if (req.url.indexOf('.css') > 0 || req.url.indexOf('.js') > 0) {
    headers['Content-Type'] = 'text/css';
    req.url.indexOf('.js') > 0 ? headers['Content-Type'] = 'application/javascript' : 0;
    res.writeHead(statusCode, headers);
    otherAssets(req, res);
  } else if (req.method === 'POST') {
    // console.dir(req.send.url);
    handlePost(req, res);
  } else if (req.method === 'GET') {
    siteFinder(req, res);
  } 
  //handle css or js
  // res.end(archive.paths.list);
};

    
