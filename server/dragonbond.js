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
		'delete' : function(id) {
			var deleteID = {};
			deleteID['_id'] = id;
			Members.remove(deleteID);
		},
		'update' : function(id, value, key) {
			var update = {};
			update[key] = value;
			Members.update(id, {$set: update});
		},
		//this is a testing method
		'getObject' : function(id) {
			var object = {};
			object['_id'] = id;
			console.log(Members.find(object).fetch());
		}
	});
}

