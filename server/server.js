var express = require('express');
var natural = require('express');
var opengraph = require('./opengraph');

var app = express();
app.configure(function(){
    app.use(express.static(__dirname + '/public'));
});

/* Queries */

queries = {
    gender: 'SELECT+sex+FROM+user+WHERE+uid+IN+(SELECT+uid2+FROM+friend+WHERE+uid1+=+me());',
    mutuals: 'SELECT+name,mutual_friend_count+FROM+user+WHERE+uid+IN+(SELECT+uid2+FROM+friend+WHERE+uid1+=+me());'
}

/* Routes */

app.get('/', function(req, res){
    res.render("./public/index.html");
});

app.get('/query', function(req, res){
    var token = "AAACEdEose0cBAGA5QfN41oZBIJ2auzSQY5QSFkiQY1ATMNZCMoVx1tvKQDCmZC8PpicIKrYr5cYkZAW9BI4BHultwuXNhZCAnhKEjZBzXdBKVYZBSXdP4Sk";
    opengraph.fql(queries[req.query.type], token, function(data) {
        if (res == null) {
            error();
        }
        res.json(data);
    });
});

app.listen(3000);
console.log("Server Started on port 3000");
