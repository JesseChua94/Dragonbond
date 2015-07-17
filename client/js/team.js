if (Meteor.isClient) {
	Meteor.subscribe('members');

	Template.team.helpers({
			'members' : function() {
				return Members.find({member: {$exists: true}}).fetch();
			},
			//this should not be hardcoded
			'headers' : function () {
				array = ['name', 'weight', 'email', 'phone'];
				return _.map(array, function(value) {
					return {heading: value}
				});
			},
			'setWeek' : function() {
				var weekID = Session.get('activeWeek');
				if (weekID == null) {
					var week = Weeks.findOne({week : 'Week 1'}).week;
					return week;
				};
				var week = Weeks.findOne({_id: weekID}).week;
				return week;
			},
			'show' : function() {
				return Session.get('warning');
			}
		});

	Template.team.events({
			'click .add' : function() {
				Meteor.call('insertMember', "", "", "", "");
			},
			'click .trash' : function() {
		  		Session.set('warning', true);
		  		Session.set('deleteID', this._id);
		  		console.log('clicked');
		  	}
		});
};

