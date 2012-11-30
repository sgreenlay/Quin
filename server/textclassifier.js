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
	var text = ' ' + test + ' ';
	var scores = new Object();
	
	var kvs = _.max(_.map((_.pairs(tc.kv), function (kval) {
		var score = 0;
		for (phrase in kval[1]) {
			if (text.indexOf(' ' + phrase + ' ') > 0) {
				score = score + 1;
			}
		}
		return { key : kval[0], score : score };
	}), function (ksco) {
		return ksco.score;
	});
}

// Gender training set
var genderFeatures = [
	'girl',
	'boy',
	'guy',
	'male',
	'female',
	'sex',
	'gender'
];
tc.addKeyPhrases(genderFeatures, 'gender');

// Languages training set
var languageFeatures = [
	'speak',
	'speaking'
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
	'muslum',
	'jewish',
	'jew',
	'mormon'
];
tc.addKeyPhrases(religions, 'religion');

// Current schools training set
var schoolFeatures = [
	'studying',
	'studies',
	'study',
	'goes to',
	'go to'
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
	'visiting'
];
tc.addKeyPhrases(locationFeatures, 'current_loc');

// Current job training set
var companyFeatures = [
	'work',
	'working',
	'employed',
	'job'
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
