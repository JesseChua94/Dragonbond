var EDITING_KEY = 'EDITING_ID';

if (Meteor.isClient) {
	Meteor.subscribe('weeks');

	Meteor.subscribe('members');


Template.team.helpers({
		'member' : function() {
			return Members.find({});
		},
		'weeks' : function() {
			return  Weeks.find({});
		},
		'headers' : function () {
			array = ['name', 'weight', 'email', 'phone'];
			return _.map(array, function(value) {
				return {heading: value}
			});
		}
	});

Template.team.events({
		'submit .addWeek' : function() {
			event.preventDefault();
			var week = event.target.newWeek.value;
			Meteor.call('insert', week, week, week, week);
		},
		'click #check' : function() {
			Meteor.call('check');
		},
		'click #delete' : function() {
			Meteor.call('delete');
		},
	  	'keydown input[type=text]': function(event) {
		    // ESC or ENTER
		    if (event.which === 27 || event.which === 13) {
		      event.preventDefault();
		      event.target.blur();
	    	}
	  	},
		// update the text of the item on keypress but throttle the event to ensure
		// we don't flood the server with updates (handles the event at most once 
		// every 300ms)
		'keyup input.data': _.throttle(function(event) {
			value = event.target.value;
			name = event.target.name;
		  	Meteor.call("update", this._id, value, name);
		}, 300)
	});
};

