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
		'insertMember' : function(newName, newWeight, newEmail, newPhone, newAttendance) {
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
					attendance : newAttendance,
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
		'update' : function(id, value, key, month, maybeWeek) {
			var update = {};
			if (month == null || month == 'Member Info') {
				update['member.info.' + key] = value;
			} else {
				maybeWeek ? "" : maybeWeek = '1';
				maybeWeek = "Week " + maybeWeek;
				var name = Members.findOne({_id: id}).member.weights[month][maybeWeek][key];
				update['member.weights.' + month + '.' + maybeWeek
					+ '.' + key] = name.split('-')[0] + '-' + value;
			}
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
			//Members.remove({});
			//Workouts.remove({});
		},
		'nextMonth' : function(next) {
			Months.update({}, {$set: {index: next}});
		},
		'previousMonth' : function(previous) {
			Months.update({}, {$set: {index: previous}});
		}
	});
}