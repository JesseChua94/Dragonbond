if (Meteor.isClient) {
	Meteor.subscribe('workouts');

	Template.singleWorkout.events({
		//have to change this to add in format of 
		// e1: 'push ups-3x10'
		// week- week number
		'keyup .workoutName, keyup .workoutReps': _.throttle(function(event) {
			var exercise = event.target.name;
			var week = 'Week ' + $('[id=' + this.id + ']').attr('mWeek');
			console.log('this is mWeek ' + week);
			var eArray = [];
			$('input[name='+ exercise + '][id='+ this.id +']').each(function() {
				eArray.push($(this).val());
			});
			var eName = eArray[0];
			var eReps = eArray[1];
			if (/[0-9a-z]/i.test(eName) && /[0-9a-z]/i.test(eReps)){
				var index = parseInt(Months.findOne({}).index);
				var currentMonth = Months.findOne({}).months[index];
		  		Meteor.call("updateWorkoutExercises", this.id, currentMonth, exercise, eName, eReps, week);
		  	}
		}, 300)
	});
	Handlebars.registerHelper('exerciseGetter', function(mObj, objID, week) {
		result =[];
		for (var key in mObj) {
			var valueArray = mObj[key].split('-');
			var eName = valueArray[0];
			console.log('this is the week number' + week);
			if (valueArray.length == 1) {
				var eReps = "";
			} else if (valueArray.length == 2) {
				var eReps = valueArray[1];
			};
			result.push({id: objID, exercise: key, name: eName, reps: eReps, mWeek: week});
		};
		return result;
	});

}