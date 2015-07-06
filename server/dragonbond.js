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
	Meteor.publish("months", function() {
		return Months.find({});
	});


	Meteor.methods({
		'insertMember' : function(newName, newWeight, newEmail, newPhone) {
			Members.insert({member: { info: { 
				name: newName,
				weight: newWeight,
				email: newEmail,
				phone: newPhone },
				weights:{}
				//weights: { {month: {current: January, week: 2, exercises:{}  }  }, 
				//		     {month: ....}  }
			}
			});
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
		//this is testing method
		'deleteAll' : function() {
			Members.remove({});
			Workouts.remove({});
		},
		'insertWorkout' : function(newWeek, currentMonth) {
			Workouts.insert({ month: {
				week: newWeek,  //should be just a number
				current: currentMonth,
				//Need a better way to have 5 default blank exercises
				exercises: {" ": "", "  ": "", "   ": "", "    ": "", "": ""},
				title: "",
				notes: ""}
			});
			//insert into member the exercises of the week being added
			/*for (m in Members.find({}).fetch()) {
				var ex = {};
				var week = "member.weights.Week " + newWeek;
				ex[week] = {};
				var id = Members.find({}).fetch()[m]._id;
				console.log(Members.update({_id: id}, {$set :ex}));
			};*/
		},
		//have to update the workout in members as well. Not implemented yet
		'updateWorkout' : function(id, value, key) {
			var update = {};
			update[key] = value;
			Workouts.update(id, {$set: update});


		},
		//make sure to also delete the week/workout from the members
		'deleteWorkout' : function(id) {
			var deleteID = {};
			deleteID['_id'] = id;
			Workouts.remove(deleteID);
		},
		'nextMonth' : function(next) {
			Months.update({}, {$set: {index: next}});
		},
		'previousMonth' : function(previous) {
			Months.update({}, {$set: {index: previous}});
		}
	});
}

