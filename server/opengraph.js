/*
 * WhoSaidIt
 * opengraph.js
 */

var https = require('https');

var opengraph = exports;

opengraph.api = function(path, callback) {
    var options = {
        host: 'graph.facebook.com',
        port: 443,
        path: path,
        method: 'GET'
    };
    
    var req = https.request(options, function(res) {
        var data = '';
        
        res.on('data', function(chunk) {
            data += chunk;
        });
        res.on('end', function() {
            callback(JSON.parse(data));
        });
    });
    req.end();
    
    req.on('error', function(e) {
        callback(null);
    });
};
opengraph.fql = function(query, token, callback) {
    var options = {
        host: 'graph.facebook.com',
        port: 443,
        path: '/fql?q=' + query + '&access_token=' + token,
        method: 'GET'
    };
    
    var req = https.request(options, function(res) {
        var data = '';
        
        res.on('data', function(chunk) {
            data += chunk;
        });
        res.on('end', function() {
            callback(JSON.parse(data));
        });
    });
    req.end();
    
    req.on('error', function(e) {
        callback(null);
    });
};
