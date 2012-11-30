var _ = require('underscore');

var tc = exports;

tc.kv = new Object();

tc.addKeyPhrases = function(phrases, key) {
	if (tc.kv[key]) {
		tc.kv[key] = _.union(tc.kv[key], phrases);
	}
	else {
		tc.kv[key] = phrases;
	}
};

tc.classify = function(text) {
	var text = " " + text + " ";
	var scores = new Object();
	
	var pairs = _.pairs(tc.kv);
	var scores = _.map(pairs, function (kval) {
		var score = 0;
		_.each(kval[1], function (phrase) {
			if (text.indexOf(" " + phrase + " ") >= 0) {
				score = score + 1;
			}
		});
		return { key : kval[0], score : score };
	});
	
	var best = _.max(scores, function (ksco) {
		return ksco.score;
	});
	
	if (best.score == 0) {
		return 'none';
	}
	return best.key;
}

// Gender training set
var genderFeatures = [
	'girl',
	'boy',
	'guy',
	'male',
	'girls',
	'boys',
	'guys',
	'males',
	'females',
	'women',
	'men',
	'sex',
	'gender'
];
var genderMistakes = [
	'mail'
];
tc.addKeyPhrases(genderFeatures, 'gender');
tc.addKeyPhrases(genderMistakes, 'gender');

// Languages training set
var languageFeatures = [
	'speak',
	'speaking',
	'speaks',
	'fluent'
];
var languages = [
	'english',
	'french',
	'german',
	'spanish',
	'mandarin',
	'hindi',
	'arabic',
	'portuguese',
	'russian',
	'japanese',
	'vietnamese',
	'italian',
	'korean'
];
tc.addKeyPhrases(languageFeatures, 'languages');
tc.addKeyPhrases(languages, 'languages');

// Religion training set
var religions = [
	'atheist',
	'christian',
	'catholic',
	'muslim',
	'jewish',
	'jew',
	'mormon',
	'agnostic',
	'hindu',
	'buddhist',
	'scientologist'
];
tc.addKeyPhrases(religions, 'religion');

// Current schools training set
var schoolFeatures = [
	'studying',
	'studies',
	'study',
	'goes to',
	'go to',
	'at'
];
var schools = [
	'waterloo',
	'laurier',
	'uw'
];
tc.addKeyPhrases(schoolFeatures, 'current_school');
tc.addKeyPhrases(schools, 'current_school');

// Current location training set
var locationFeatures = [
	'living',
	'located',
	'house',
	'apartment',
	'visiting',
	'in',
	'lives'
];
tc.addKeyPhrases(locationFeatures, 'current_loc');

// Current job training set
var companyFeatures = [
	'work',
	'working',
	'employed',
	'job',
	'at',
	'works'
];
var companies = [
	'google',
	'facebook',
	'microsoft',
	'twitter'
];
tc.addKeyPhrases(companyFeatures, 'current_job');
tc.addKeyPhrases(companies, 'current_job');

// Mutual friends training set
var mutualFeatures = [
	'common',
	'mutual'
];
tc.addKeyPhrases(mutualFeatures, 'mutual');

// Most friends training set
var mostFriendFeatures = [
	'most friends',
	'largest number of friends',
	'most popular'
];
tc.addKeyPhrases(mostFriendFeatures, 'friends');
 
