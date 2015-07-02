if (Meteor.isClient) {
	Meteor.subscribe('weeks');

	Meteor.subscribe('members');

	Template.team.helpers({
			'members' : function() {
				return Members.find({member: {$exists: true}}).fetch();
			},
			'weeks' : function() {
				return  Weeks.find({});
			},
			//this should not be hardcoded
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
				var weekID = Session.get('activeWeek');
				if (weekID == null) {
					var week = Weeks.findOne({week : 'Week 1'}).week;
					return week;
				};
				var week = Weeks.findOne({_id: weekID}).week;
				return week;
			}
		});

	Template.team.events({
			'click .add' : function() {
				Meteor.call('insertMember', " ", " ", " ", " ");
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
	});
	//Allows to dynamically add attributes to the table
	Handlebars.registerHelper('memberInfoGetter', function(obj) {
		result =[];
		for (var key in obj) {
			result.push({name: key, value: obj[key]});
		};
		return result;
	});
};

