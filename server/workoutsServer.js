if (Meteor.isServer) {
	Meteor.methods({
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
			mUpdate['member.weights.' + currentMonth + '.' + week + '.' + exercise] = eName + "-";
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
		}
	});
}