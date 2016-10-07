var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var url = require('url');
var headers = require('../web/http-helpers').headers;
var fetcher = require('../workers/htmlfetcher');

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
    console.log(urlsData);
  });

  req.on('end', function() {
    fs.readFile(archive.paths.list, 'utf8', function(error, data) {
      var exists = false;
      data.indexOf(memory) !== -1 ? exists = true : 0;
      //checking to see if there is any data
      if (exists) {
        var fileName = './web/public/loading.html';
        fs.readFile(fileName, 'utf8', function(error, data) {
          res.end(data);
        });
      } else {
        //if there isnt data 
        var urlForFile = archive.paths.archivedSites;
        fs.readdir(urlForFile, function(error, files) {
          var exists = false;
          files.indexOf(memory) !== -1 ? exists = true : 0;
          //if the file in the sites folder is there
          if (exists) {
            fs.readFile(archive.paths.archivedSites + '/' + memory, 'utf8', function(error, data) {
              res.end(data);
            });
          } else {
            //no file and no data
            archive.addUrlToList(memory);
            // activate if no cron job running
            // console.log('hedsfsdfsdare');
            // setTimeout(function() {
            //   fetcher.htmlfetcher();
            // 
            // }, 300);
            var fileName = './web/public/loading.html';
            fs.readFile(fileName, 'utf8', function(error, data) {
              res.end(data);
            });    
          }
        });
      }
    });    
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
  var statusCode = 200;
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
    handlePost(req, res);
  } else if (req.method === 'GET') {
    siteFinder(req, res);
  } 
};

    
