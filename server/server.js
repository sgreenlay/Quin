var express = require('express');
var natural = require('express');
var opengraph = require('./opengraph');

var app = express();
app.configure(function(){
    app.use(express.static(__dirname + '/public'));
});

/* Helpers */

var genderQuery = function(token, callback) {
    var query = 'SELECT+sex+FROM+user+WHERE+uid+IN+(SELECT+uid2+FROM+friend+WHERE+uid1+=+me());';
    opengraph.fql(query, token, function(res) {
        if (res == null) {
            error();
        }
        callback(res);
    });
}

/* Routes */

app.get('/', function(req, res){
    res.render("./public/index.html");
});

app.get('/query', function(req, res){
    var token = "AAACEdEose0cBALWiNiHZBMHhZCQmz0Ui2nNiKLIqOyOHHrpVud0jGjMIwLPDaVSxU97LSDkrGgz15GPbZCZAvWN9sgEzj2ldWgBoVwNFpgt56MRxZBSnr";
    genderQuery(token, function(data) {
        res.json(data);
    });
});

app.listen(3000);
console.log("Server Started on port 3000");
