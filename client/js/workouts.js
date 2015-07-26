if (Meteor.isClient) {
	var timeout;
	Meteor.subscribe("workouts");
	Meteor.subscribe("months");

	Template.workouts.helpers({
		//sort not working for some reason
		'workout' : function() {
			var index = parseInt(Months.findOne({}).index);
			var currentMonth = Months.findOne({}).months[index];
			return Workouts.find({'month.current': currentMonth}, 
				{sort: {'month.week': 1}}).fetch();
		},
		'show' : function() {
			return Session.get('warning');
		},
		'showAlert' : function() {
			return Session.get('alert');
		},
		'showMonth' : function() {
			var index = parseInt(Months.findOne({}).index);
			return Months.findOne({}).months[index];
		}
	});

	Template.workouts.events({
		'click .addWorkout' : _.throttle(function(event) {
			var index = parseInt(Months.findOne({}).index);
			var currentMonth = Months.findOne({}).months[index];
			var count = Workouts.findOne({'month.current': currentMonth}, {sort:{month: {week: -1}}});
			if (count == null) {
				count = 1;
				Meteor.call("insertWorkout", count, currentMonth);
			} else if (count.month.week > 4) {
				Session.set('alert', true);
			} else if (count.month.week >= 1) {
				count = count.month.week + 1;
				Meteor.call("insertWorkout", count, currentMonth);
			};
		}, 400),
		//testing function
		'click .workoutType, click .workoutWeek, click .workoutReps, click .workoutName' : function() {
			console.log(this.id);
			console.log(this._id);
		},
		//testing function
		'click .deleteAll' : function() {
			Meteor.call('deleteAll');
		},
		'click .trashWorkout' : function() {
		  		Session.set('warning', true);
		  		Session.set('deleteID', this._id);
		  		Session.set('weekNumber', this.month.week);
		  		Session.set('month', this.month.current);
		},
		//this is repeated in team.js. Should change later to one js file.
		'keydown .workoutType, keydown .workoutReps, keydown .workoutWeek, keydown .workoutName': function(event) {
			    // ESC or ENTER
			    if (event.which === 27 || event.which === 13) {
			      event.preventDefault();
			      event.target.blur();
		    	}
		},
		'click .prev' : function () {
			var index = Months.findOne({}).index;
			if (index > 0) {
				Meteor.call('previousMonth', index - 1);
				console.log(index);
			};
		},
		'click .nex' : function() {
			var length = Months.findOne({}).months.length - 1;
			var index = Months.findOne({}).index;
			if (index < length) {
				Meteor.call('nextMonth', index + 1);
				console.log(index);

			};
		},
		'keypress .workoutType, keypress .workoutWeek': function(event) {
			var id = this._id;
			if (timeout) {
				clearTimeout(timeout);
				timeout = null;
			}
			timeout = setTimeout(function() {
				value = event.target.value;
				name = event.target.name;
			  	Meteor.call("updateWorkout", id, value, name);
			}, 600);
		}
	});

	Template.warningWorkout.events({
		'click .resetAlert' : function() {
			Session.set('warning', false);
			console.log(Session.get('warning'));
		},
		'click .yes' : function() {
			var deleteID = Session.get('deleteID');
			var weekNumber = Session.get('weekNumber');
			var month = Session.get('month');
			Meteor.call("deleteWorkout", deleteID, weekNumber, month);
		}
	});

	Template.alertWorkout.events({
		'click .dismiss' : function() {
			Session.set('alert', false);
		}
	});
}