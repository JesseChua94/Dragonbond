if (Meteor.isServer) {
	Meteor.publish("weeks", function() {
		return Weeks.find({});
	});
	Meteor.publish("members", function() {
		return Members.find({});
	});
	Meteor.publish("workouts", function() {
		return Workouts.find({});
	});


	Meteor.methods({
		'insertMember' : function(newName, newWeight, newEmail, newPhone) {
			Members.insert({member: { info: { 
				name: newName,
				weight: newWeight,
				email: newEmail,
				phone: newPhone },
				weights: {
					'Week1': {'Pull ups': "", 'Bench': ""},
					'Week2': {'Pull ups': "yay", 'Bench': "you did it!"}
				}
			}
			});
		},
		'addWeek' : function(week) {
			Weeks.insert({week: week});
		},
		'delete' : function(id) {
			var deleteID = {};
			deleteID['_id'] = id;
			Members.remove(deleteID);
		},
		'update' : function(id, value, key) {
			var update = {};
			update['member.' + key] = value;
			Members.update(id, {$set: update});
		},
		//this is a testing method
		'getObject' : function(id) {
			var object = {};
			object['_id'] = id;
			console.log(Members.find(object).fetch());
		},
		'insertWorkout' : function(
			newTitle, newWeek) {
			Workouts.insert({ 
				week: newWeek,
				exercises: {},
				title: newTitle,
				notes: ""});

		},
		'updateWorkout' : function(id, value, key) {
			var update = {};
			update[key] = value;
			Workouts.update(id, {$set: update});
		},
		'deleteWorkout' : function(id) {
			var deleteID = {};
			deleteID['_id'] = id;
			Workouts.remove(deleteID);
		}
	});
}

