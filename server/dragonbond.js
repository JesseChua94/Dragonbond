if (Meteor.isServer) {
	Meteor.publish("weeks", function() {
		return Weeks.find({});
	});
	Meteor.publish("members", function() {
		return Members.find({});
	});


	Meteor.methods({
		'insert' : function(newName, newWeight, newEmail, newPhone) {
			Members.insert({
				name: newName,
				weight: newWeight,
				email: newEmail,
				phone: newPhone
			});
		},
		'addWeek' : function(week) {
			Weeks.insert({week: week});
		},
		'check' : function() {
			Members.find({}).count();
		},
		'delete' : function() {
			Weeks.remove({});
		},
		'update' : function(id, value, key) {
			Members.update(id, {$set: {key: value}});

		}
	});
}

