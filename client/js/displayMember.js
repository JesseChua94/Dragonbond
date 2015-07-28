if (Meteor.isClient) {
	var timeout;
	Meteor.subscribe('members');

	Template.displayMember.helpers({
		'weekSelected' : function() {
			return Session.get('selectedWeek');
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
		  		this.mID == null? Meteor.call('getObject', this._id) : Meteor.call('getObject', this.mID);
		  	},
		  	'click .week li' : function() {
		  		Session.set('activeWeek', this._id);
		  	},
			// update the text of the item on keypress but throttle the event to ensure
			// we don't flood the server with updates (handles the event at most once 
			// every 600ms)
			'keypress input.data': function(event) {
				var id = this.mID;
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
			},
			'click .attend' : function() {
			Session.set('clickedAttended', true);
			changeAttend(this._id);
			},
			'click .notAttend' : function() {
				Session.set('clickedAttended', false);
				changeNotAttend(this._id);
			}
		});
	//Allows to dynamically add attributes to the table
	Handlebars.registerHelper('infoGetter', function(mObj, objID) {
		var result = [];
		var selectedMonth = Session.get('selectedMonth');
		if (selectedMonth == 'Member Info' || selectedMonth == null){
			for (var obj in mObj.info) {
				for (var key in mObj.info[obj]){
					result.push({mID: objID, name: key, value: mObj.info[obj][key]});
				};
			};
			return result;
		} else {
			var maybeWeek = Session.get('selectedWeek');
			maybeWeek ? "" : maybeWeek = '1';
			maybeWeek = "Week " + maybeWeek;
			var monthWeek = mObj.weights[selectedMonth][maybeWeek];
			var mName = mObj.info[0].name;
			result.push({mID: objID, name: 'name', value: mName});	
			for (var key in monthWeek) {
				var val = monthWeek[key].split('-');
				if (val[0] == "") {break} else {
					result.push({mID: objID, name: key, value: val[1]})
				};
			}
			return result;
		};
	});
};

function changeAttend(id) {
	document.getElementById(id).innerHTML = 
		'<button type="button" mID="' + id + '" class="notAttend btn btn-default" aria-label="Left Align">' + 
			'<span class="glyphicon glyphicon-ok" aria-hidden="true"></span> </button>';
};

function changeNotAttend(id) {
	document.getElementById(id).innerHTML = 
		'<button type="button" mID="' + id + '" class="attend btn btn-default" aria-label="Left Align">' +
			'<span class="glyphicon glyphicon-remove" aria-hidden="true"></span> </button>';
};

