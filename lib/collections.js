Members = new Mongo.Collection("members");
Workouts = new Mongo.Collection("workouts");
Months = new Mongo.Collection("months");

Meteor.startup(function() {
	Factory.define('mObj', Months, {
		index: 0, 
	months: ['September', 'October', 'November', 
		'December', 'January', 'February', 'March', 'April', 'May']}
	);

	if (Months.find({}).count() === 0) {
		Factory.create('mObj');
	};
});
