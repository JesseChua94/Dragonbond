if (Meteor.isClient) {

	Template.home.helpers({
		'date' : function() {
			return moment().format("dddd, MMMM Do YYYY");
		}
	});

}