if (Meteor.isClient) {
	Meteor.subscribe('months');

	Template.home.helpers({
		'date' : function() {
			return moment().format('dddd, MMMM Do YYYY');
		},
		'displayWorkout' : function() {
			var workoutDate = Months.findOne().workoutDate;
			var day = moment().day();
			var date = moment().date();
			var month = moment().format('MMMM');
			//checking if monday and not the same monday
			if (day == 1 && workoutDate != date) {
				return '';
			};
			return {yes: 'ahhhhh', no: 'booooo'}
		}
	});

}