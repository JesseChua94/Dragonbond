if (Meteor.isServer) {
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
			//Add every month to new member
			var addMonths = {};
			var months = Months.findOne().months;
			var memberID;
			for (i in months) {
				addMonths[months[i]] = {};
			};

			Members.insert({member: { 
				info: { 
					name: newName,
					weight: newWeight,
					email: newEmail,
					phone: newPhone 
				},
				weights: addMonths
				//weights: {January: {week 1: {e1: push ups-3x10, e2: sit ups-3x10, e3: "", e4: "", e5: ""}, week2: {}, week3: {} }, 
				//			 February: {week 1: {pushups: 10, situps: 5}, week2: {}, week3: {}} , 
				//		     	...  }
				}
			}, function (err, result){
				if (err) console.log("this is an error" + err);
				else {
					memberID = result;
				}
			});
				
			var workouts = Workouts.find({}).fetch();
			for (i = 0; i < workouts.length; i++) {
				workouts[i]
				var currentMonth = workouts[i].month.current;
				var currentWeek = 'Week ' + workouts[i].month.week;
				var currentExercises = workouts[i].month.exercises;
				var mUpdate = {};
				mUpdate['member.weights.' + currentMonth + '.' + currentWeek] = currentExercises;
				Members.update({_id: memberID}, {$set: mUpdate}, {upsert: true});
			};
		},
		'delete' : function(id) {
			var deleteID = {};
			deleteID['_id'] = id;
			Members.remove(deleteID);
		},
		'update' : function(id, value, key) {
			var update = {};
			update['member.info.' + key] = value;
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
				current: currentMonth, //this is the month NAME
				exercises: {e1: "", e2: "", e3: "", e4: "", e5: ""},
				// e1: 'push ups-3x10'
				title: "",
				notes: ""}
			});
		},
		'updateWorkout' : function(id, value, key) {
			var update = {};
			update['month.' + key] = value;
			Workouts.update(id, {$set: update});
		},
		//currentMonth - e.g. September, February
		//exercise - key for exercises e.g. e1, e2, e3
		//eName - name of exercise
		// eReps - number of reps
		// week - full week
		'updateWorkoutExercises' : function(id, currentMonth, exercise, eName, eReps, week) {
			var wUpdate = {};
			var nameAndReps = eName + "-" + eReps;
			wUpdate['month.exercises.' + exercise] = nameAndReps;
			Workouts.update({_id: id} , {$set: wUpdate});

			var mUpdate = {};
			mUpdate['member.weights.' + currentMonth + '.' + week + '.' + exercise] = nameAndReps;
			Members.update({}, {$set: mUpdate}, {upsert: true, multi: true});
		},
		'deleteWorkout' : function(id, weekNumber, month) {
			var deleteID = {};
			deleteID['_id'] = id;
			Workouts.remove(deleteID);
			var week = 'Week ' + weekNumber;

			//working with limited testing. Not sure if need to put in try/catch
			var deleteWeek = {};
			var key = 'member.weights.' + month + '.' + week;
			deleteWeek[key] = 1;
			console.log(key);
			Members.update({}, {$unset: deleteWeek}, {multi: true});
		},
		'nextMonth' : function(next) {
			Months.update({}, {$set: {index: next}});
		},
		'previousMonth' : function(previous) {
			Months.update({}, {$set: {index: previous}});
		}
	});
}

