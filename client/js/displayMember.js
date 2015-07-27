if (Meteor.isClient) {
	var timeout;
	Meteor.subscribe('members');

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
		  		this.id == null? Meteor.call('getObject', this._id) : Meteor.call('getObject', this.id);
		  	},
		    //working on the deletion of information
		  	'click .week li' : function() {
		  		Session.set('activeWeek', this._id);
		  	},
			// update the text of the item on keypress but throttle the event to ensure
			// we don't flood the server with updates (handles the event at most once 
			// every 600ms)
			'keypress input.data': function(event) {
				var id = this.id;
				if (timeout) {
					clearTimeout(timeout);
					timeout = null;
				}
				timeout = setTimeout(function() {
					var value = event.target.value;
					var name = event.target.name;
					var selectedMonth = Session.get('selectedMonth');
					var maybeWeek = Session.get('selectedWeek');
				  	Meteor.call("update", id, value, name, selectedMonth, maybeWeek);
				  	clearTimeout(timeout);
				}, 600);
			}	
		});
	//Allows to dynamically add attributes to the table
	Handlebars.registerHelper('infoGetter', function(mObj, objID) {
		var result = [];
		var selectedMonth = Session.get('selectedMonth');
		if (selectedMonth == 'Member Info' || selectedMonth == null){
			for (var obj in mObj.info) {
				for (var key in mObj.info[obj]){
					result.push({id: objID, name: key, value: mObj.info[obj][key]});
				};
			};
			return result;
		} else {
			var maybeWeek = Session.get('selectedWeek');
			maybeWeek ? "" : maybeWeek = '1';
			maybeWeek = "Week " + maybeWeek;
			var monthWeek = mObj.weights[selectedMonth][maybeWeek];
			var mName = mObj.info[0].name;
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