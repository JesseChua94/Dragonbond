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
				var selectedMonth = Session.get('selectedMonth');
				var maybeWeek = Session.get('selectedWeek');
			  	Meteor.call("update", this.id, value, name, selectedMonth, maybeWeek);
			}, 300)
		});
	//Allows to dynamically add attributes to the table
	Handlebars.registerHelper('infoGetter', function(mObj, objID) {
		var result = [];
		var selectedMonth = Session.get('selectedMonth');
		if (selectedMonth == 'Member Info' || selectedMonth == null){
			for (var key in mObj.info) {
				result.push({id: objID, name: key, value: mObj.info[key]});
			};
			return result;
		} else {
			var maybeWeek = Session.get('selectedWeek');
			maybeWeek ? "" : maybeWeek = '1';
			maybeWeek = "Week " + maybeWeek;
			var monthWeek = mObj.weights[selectedMonth][maybeWeek];
			var mName = mObj.info.name;
			result.push({id: objID, name: 'name', value: mName});	
			for (var key in monthWeek) {
				var val = monthWeek[key].split('-');
				if (val[0] == "") {break} else {
					result.push({id: objID, name: key, value: val[1]})
				};
			}
			return result;
		};
	});
};