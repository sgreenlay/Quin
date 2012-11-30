var _ = require('underscore');
var pos = require('pos');

var qp = exports;

qp.processQuery = function(query, category) {
	console.log(query);
	var words = new pos.Lexer().lex(query);
	var taggedWords = new pos.Tagger().tag(words);
	/*
	for (i in taggedWords) {
		var taggedWord = taggedWords[i];
		var word = taggedWord[0];
		var tag = taggedWord[1];
		console.log(word + " /" + tag);
	}
	*/
	
	switch (category) {
		case 'current_loc':
			var locations = _.map(_.filter(taggedWords, function(taggedWord) {
				if (taggedWord[1] == 'NN') {
					return true;
				}
				return false;
			}), function(taggedWord) {
				return taggedWord[0];
			});
			
			console.log(locations);
			
			break;
		default:
			break;
	}
};

