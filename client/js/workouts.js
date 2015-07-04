if (Meteor.isClient) {
	Meteor.subscribe("workouts");

	Template.workouts.helpers({
		'workout' : function() {
			return Workouts.find({});
		},
		'show' : function() {
				return Session.get('warning');
		}
	});

	Template.workouts.events({
		'click .addWorkout' : function() {
			console.log("added");
			var weekCount = Workouts.find({}).count() + 1;
			Meteor.call("insertWorkout",
				'Week ' + weekCount + ' - ', weekCount);
		},
		//testing function
		'click .workoutName, click .workoutWeek, click .workoutReps' : function() {
			console.log(this._id);
		},
		'click .trashWorkout' : function() {
		  		Session.set('warning', true);
		  		Session.set('deleteID', this._id);
		},
		//this is repeated in team.js. Should change later to one js file.
		'keydown .workoutName, keydown .workoutReps, keydown .workoutWeek': function(event) {
			    // ESC or ENTER
			    if (event.which === 27 || event.which === 13) {
			      event.preventDefault();
			      event.target.blur();
		    	}
		},
		//this is also repeated
		'keyup .workoutName, keyup .workoutReps, keyup .workoutWeek': _.throttle(function(event) {
				value = event.target.value;
				name = event.target.name;
			  	Meteor.call("updateWorkout", this._id, value, name);
			}, 300)
		});


	Template.warningWorkout.events({
		'click .resetAlert' : function() {
			Session.set('warning', false);
			console.log(Session.get('warning'));
		},
		'click .yes' : function() {
			var deleteID = Session.get('deleteID');
			Meteor.call("deleteWorkout", deleteID);

		}
	})
}