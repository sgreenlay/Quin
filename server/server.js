var _ = require('underscore');
var express = require('express');
var tc = require('./textclassifier');
var qp = require('./queryprocessor');

var app = express();
app.configure(function(){
    app.use(express.static(__dirname + '/public'));
});

/* Routes */

app.get('/', function(req, res){
    res.render("./public/index.html");
});

app.get('/typeify', function(req, res) {
    
    query = req.query.query.toLowerCase();
    type = tc.classify(query);
    
    console.log("Processing query '" + query + "' Type: " + type);
    
    res.json(type);
});

app.get('/query', function(req, res){
    var token, type, text;
    
    type = req.query.type;
    if (type == null) {
        return;
    }
    text = req.query.text.toLowerCase();
    
    console.log(req.query);
    
    var query = qp.query(text, type, function (data, err) {
        res.json(data);
    });
});

app.listen(process.env.PORT);
console.log("Server Started on port " + process.env.PORT);
