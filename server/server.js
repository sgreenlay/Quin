var express = require('express');
var opengraph = require('./opengraph');

var app = express();
app.configure(function(){
    app.use(express.static(__dirname + '/public'));
});

/* Helpers */

var ageQuery = function(token, callback) {
    var query = '';
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
    ageQuery(req.query.token, function(data) {
        res.json(data);
    });
});

app.listen(3000);
console.log("Server Started on port 3000");
