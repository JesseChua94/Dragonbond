if (Meteor.isClient) {
	Meteor.subscribe('members');

	Template.warningMember.events({
		'click .resetAlert' : function() {
			Session.set('warning', false);
			console.log(Session.get('warning'));
		},
		'click .yes' : function() {
			var deleteID = Session.get('deleteID');
			Meteor.call("delete", deleteID);

		}
	});
} 