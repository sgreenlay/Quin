var _ = require('underscore');
var express = require('express');
var natural = require('natural');
var opengraph = require('./opengraph');
var tc = require('./textclassifier');
var pos = require('pos');

var app = express();
app.configure(function(){
    app.use(express.static(__dirname + '/public'));
});

queries = {
    gender: 'SELECT+name,sex+FROM+user+WHERE+uid+IN+(SELECT+uid2+FROM+friend+WHERE+uid1+=+me());',
    mutuals: 'SELECT+name,mutual_friend_count+FROM+user+WHERE+uid+IN+(SELECT+uid2+FROM+friend+WHERE+uid1+=+me());',
    friends: 'SELECT+name,friend_count+FROM+user+WHERE+uid+IN+(SELECT+uid2+FROM+friend+WHERE+uid1+=+me());',
    current_loc: 'SELECT+name,current_location.city+FROM+user+WHERE+uid+IN+(SELECT+uid2+FROM+friend+WHERE+uid1+=+me());',
    languages: 'SELECT+name,languages.name+FROM+user+WHERE+uid+IN+(SELECT+uid2+FROM+friend+WHERE+uid1+=+me());'
}

/* Routes */

app.get('/', function(req, res){
    res.render("./public/index.html");
});

app.get('/typeify', function(req, res) {
    query = req.query.query;
    console.log("Processing query '" + query + "' Type: " + tc.classifier.classify(query));
    res.json(tc.classifier.classify(query));
});

app.get('/query', function(req, res){
    var token, type, query;

    token = process.env.HARD_FB_TOKEN;
    type = req.query.type;
    if (type == null) {
        return;
    }

    opengraph.fql(queries[type], token, function(data) {
        if (res == null) {
            error();
        }
        res.json(data);
    });
});

app.listen(process.env.PORT);
console.log("Server Started on port " + process.env.PORT);
