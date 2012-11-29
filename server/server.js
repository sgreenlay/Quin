var express = require('express');
var opengraph = require('./opengraph');

var app = express();

app.get('/', function(req, res){
    res.send('Hello World');
});

app.listen(3000);

