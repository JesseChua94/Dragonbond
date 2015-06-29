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
			},
			'show' : function() {
				return Session.get('warning');
			},
			'setWeek' : function() {
				return Session.get('activeWeek');
			}
		});

	Template.team.events({
			'click .add' : function() {
				Meteor.call('insert', "", "", "", "");
			},
			'submit .addWeek' : function() {
				event.preventDefault();
				var week = event.target.newWeek.value;
				Meteor.call('addWeek', week);
			},
			'click #check' : function() {
				Meteor.call('check');
			},
		  	'keydown input[type=text]': function(event) {
			    // ESC or ENTER
			    if (event.which === 27 || event.which === 13) {
			      event.preventDefault();
			      event.target.blur();
		    	}
		  	},
		  	//this is a testing method
		  	'click td' : function() {
		  		console.log(this._id);
		  		Meteor.call('getObject', this._id);
		  	},
		    //working on the deletion of information
		  	'click .trash' : function() {
		  		Session.set('warning', true);
		  		Session.set('deleteID', this._id);

		  		//Meteor.call('delete', this._id);
		  	},
		  	'click .week li' : function() {
		  		Session.set('activeWeek', this._id);
		  		console.log(this._id);
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

	Template.warning.events({
		'click .resetAlert' : function() {
			Session.set('warning', false);
			console.log(Session.get('warning'));
		},
		'click .yes' : function() {
			var deleteID = Session.get('deleteID');
			Meteor.call("delete", deleteID);

		}


	})



};

