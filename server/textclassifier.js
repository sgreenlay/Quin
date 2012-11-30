var _ = require('underscore');
var natural = require('natural');

var tc = exports;

tc.classifier = new natural.BayesClassifier();

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
tc.classifier.addDocument(genderFeatures, 'gender');

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
tc.classifier.addDocument(languageFeatures, 'languages');
tc.classifier.addDocument(languages, 'languages');

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
tc.classifier.addDocument(religions, 'religion');

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
tc.classifier.addDocument(schoolFeatures, 'current_school');
tc.classifier.addDocument(schools, 'current_school');

// Current location training set
var locationFeatures = [
	'living',
	'located',
	'house',
	'apartment',
	'visiting'
];
tc.classifier.addDocument(locationFeatures, 'current_loc');

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
tc.classifier.addDocument(companyFeatures, 'current_job');
tc.classifier.addDocument(companies, 'current_job');

// Mutual friends training set
var mutualFeatures = [
	'common',
	'mutual'
];
tc.classifier.addDocument(mutualFeatures, 'mutual');

tc.classifier.train();

tc.classifier.save('classifier.json', function(err, classifier) {
	// the classifier is saved to the classifier.json file!
});
