var _ = require('underscore');
var natural = require('natural');

var tc = exports;

tc.classifier = new natural.BayesClassifier(natural.LancasterStemmer);

// Gender training set
tc.classifier.addDocument('how many of my friends are male', 'gender');
tc.classifier.addDocument('how many of my friends are female', 'gender');
tc.classifier.addDocument('male friends', 'gender');
tc.classifier.addDocument('female friends', 'gender');
tc.classifier.addDocument('how many of my friends are guys', 'gender');
tc.classifier.addDocument('how many of my friends are girls', 'gender');
tc.classifier.addDocument('how many of my friends are boys', 'gender');
tc.classifier.addDocument('girl friends', 'gender');
tc.classifier.addDocument('guy friends', 'gender');
tc.classifier.addDocument('boy friends', 'gender');
tc.classifier.addDocument('gender distribution of friends', 'gender');
tc.classifier.addDocument('gender of friends', 'gender');
tc.classifier.addDocument('sex of friends', 'gender');

// Languages training set
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

tc.classifier.addDocument('people who speak', 'languages');
tc.classifier.addDocument('friends who speak', 'languages');
tc.classifier.addDocument('people that speak', 'languages');
tc.classifier.addDocument('friends that speak', 'languages');

_.each(languages, function(language) {
	tc.classifier.addDocument('people who speak' + language, 'languages');
	tc.classifier.addDocument('people that speak' + language, 'languages');
	tc.classifier.addDocument(language + ' friends', 'languages');
	tc.classifier.addDocument(language + ' speaking friends', 'languages');
});

// Religion training set
/*
var religions = [
	'atheist',
	'christian',
	'catholic',
	'muslum',
	'jewish',
	'jew',
	'mormon'
];

_.each(religions, function(religion) {
	tc.classifier.addDocument(religion, 'religion');
	tc.classifier.addDocument(religion + ' friends', 'religion');
});
 */

// Current schools training set
var schools = [
	'waterloo',
	'laurier',
	'uw'
];

_.each(schools, function(school) {
	tc.classifier.addDocument('who studies at ' + school, 'current_school');
	tc.classifier.addDocument('how many people study at ' + school, 'current_school');
	tc.classifier.addDocument('people who study at ' + school, 'current_school');
	tc.classifier.addDocument('people who go to ' + school, 'current_school');
	tc.classifier.addDocument('how many friends study at ' + school, 'current_school');
	tc.classifier.addDocument('friends who study at ' + school, 'current_school');
	tc.classifier.addDocument('friends who go to ' + school, 'current_school');
	tc.classifier.addDocument('friends at ' + school, 'current_school');
});

// Current location training set
tc.classifier.addDocument('people living in', 'current_loc');
tc.classifier.addDocument('people in', 'current_loc');
tc.classifier.addDocument('people located in', 'current_loc');
tc.classifier.addDocument('people currently in', 'current_loc');
tc.classifier.addDocument('people visiting', 'current_loc');
tc.classifier.addDocument('people that live in', 'current_loc');
tc.classifier.addDocument('friends living in', 'current_loc');
tc.classifier.addDocument('friends in', 'current_loc');
tc.classifier.addDocument('friends located in', 'current_loc');
tc.classifier.addDocument('friends currently in', 'current_loc');
tc.classifier.addDocument('friends visiting', 'current_loc');
tc.classifier.addDocument('friends that live in', 'current_loc');

// Current job training set
var companies = [
	'google',
	'facebook',
	'microsoft',
	'twitter'
];
_.each(companies, function(company) {
	tc.classifier.addDocument('people at ' + company, 'current_job');
});
tc.classifier.addDocument('people working at', 'current_job');

// Mutual friends training set
tc.classifier.addDocument('friends I have in common with', 'mutual');
tc.classifier.addDocument('mutual friends I have with', 'mutual');
tc.classifier.addDocument('common friends with', 'mutual');
tc.classifier.addDocument('friends in common with', 'mutual');
tc.classifier.addDocument('mutual friends with', 'mutual');

tc.classifier.train();

tc.classifier.save('classifier.json', function(err, classifier) {
	// the classifier is saved to the classifier.json file!
});
