var _ = require('underscore');
var express = require('express');
var natural = require('natural');
var opengraph = require('./opengraph');

var app = express();
app.configure(function(){
    app.use(express.static(__dirname + '/public'));
});

/* Queries */
var inferType = function(query) {
    var tfidf, terms, nounInflector;
    tfidf = new natural.TfIdf();
    nounInflector = new natural.NounInflector();
    tfidf.addDocument(query);
    terms = _.map(tfidf.listTerms(0), function(x) {
        return {
            term: nounInflector.singularize(x.term),
            tfidf: x.tfidf
        }
    });
    terms = _.reject(terms, function(x) {
        return !terms_to_queries[x.term];
    });
    if (!terms.length) {
        return null;
    }

    terms = _.sortBy(terms, function(x) {
        return -x.tfidf;
    });

    // TODO: We should allow for account for multiple terms in different queries
    // TODO: We should also do some basic token searching
    return terms_to_queries[terms[0].term][0];
}

queries = {
    gender: 'SELECT+sex+FROM+user+WHERE+uid+IN+(SELECT+uid2+FROM+friend+WHERE+uid1+=+me());',
    mutuals: 'SELECT+name,mutual_friend_count+FROM+user+WHERE+uid+IN+(SELECT+uid2+FROM+friend+WHERE+uid1+=+me());',
    friends: 'SELECT+name,friend_count+FROM+user+WHERE+uid+IN+(SELECT+uid2+FROM+friend+WHERE+uid1+=+me());'
}

/* Make sure these are singular! */
queries_to_terms = {
    mutuals: ['mutual'],
    friends: ['popular', 'friend'],
    gender: ['gender', 'sex', 'boy', 'girl', 'male', 'female']
}
terms_to_queries = {}
_.each(queries_to_terms, function(x, i) {
    _.each(x, function(y) {
        if (!terms_to_queries[y]) {
            terms_to_queries[y] = [];
        }
        terms_to_queries[y].push(i);
    });
});

/* Routes */

app.get('/', function(req, res){
    res.render("./public/index.html");
});

app.get('/typeify', function(req, res) {
    query = req.query.query;
    res.json(inferType(query));
});

app.get('/query', function(req, res){
    var token, type, query;

    token = "AAACEdEose0cBAEBOlmyI3f7HQgbg5vtZCDScZA6L6ZCDZAwm2mb6jkuP9N5V53yZC2nQ5aMltKmLcmZB1ZCmTPyCBspEBu51PNIc0u1jbS0T7HDBmAa0HJ2";
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

app.listen(3000);
console.log("Server Started on port 3000");
