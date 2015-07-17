if (Meteor.isClient) {
	Meteor.subscribe('members');

	Template.displayMember.helpers({
			'members' : function() {
				return Members.find({member: {$exists: true}}).fetch();
			}
		});

	Template.displayMember.events({
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
		  		console.log(this.id);
		  		this.id == null? Meteor.call('getObject', this._id) : Meteor.call('getObject', this.id);
		  	},
		    //working on the deletion of information
		  	'click .week li' : function() {
		  		Session.set('activeWeek', this._id);
		  		console.log(this._id);
		  	},
			// update the text of the item on keypress but throttle the event to ensure
			// we don't flood the server with updates (handles the event at most once 
			// every 300ms)
			'keyup input.data': _.throttle(function(event) {
				var value = event.target.value;
				var name = event.target.name;
			  	Meteor.call("update", this.id, value, name);
			}, 300)
		});
	//Allows to dynamically add attributes to the table
	Handlebars.registerHelper('infoGetter', function(mObj, objID) {
		result =[];
		for (var key in mObj) {
			result.push({id: objID, name: key, value: mObj[key]});
		};
		return result;
	});
};