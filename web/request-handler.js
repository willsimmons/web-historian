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
  var url = req.url;
  var urlsData = '';
  var memory;
  req.on('data', function(chunk) {
    urlsData = chunk;
  });
  // console.log(urlsData);
  // req.on('end', function() {
  fs.readFile(archive.paths.list, 'utf8', function(err, data) {
    console.log(data);
    memory += data;
      // memory instanceof Buffer ? memory = Buffer.concat(memory).toString() : console.log('Chunks are not buffers');
      //check if file has urls data 
      //if not, append to file]
  });
  // });
  // console.log(JSON.stringify(memory));
  // res.end('done');
};

exports.handleRequest = function (req, res) {
  // var parser = document.createElement('a');
  var statusCode = 200;
  // parser.href = req.url;
  if (req.url === '/') {
    headers['Content-Type'] = 'text/html';
    res.writeHead(statusCode, headers);
    indexServer(req, res);
  } else {
    res.writeHead(statusCode);
    res.end();
  }
  //handle css or js
  if (req.url.indexOf('.css') > 0 || req.url.indexOf('.js') > 0) {
    headers['Content-Type'] = 'text/css';
    req.url.indexOf('.js') > 0 ? headers['Content-Type'] = 'application/javascript' : 0;
    res.writeHead(statusCode, headers);
    otherAssets(req, res);
  }

  if (req.method === 'POST') {
    handlePost(req, res);
  }
  // res.end(archive.paths.list);
};

    
