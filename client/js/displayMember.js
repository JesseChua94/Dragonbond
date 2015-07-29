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
		  		console.log(this.mID);
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
				};
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
				var id = this._id;
				if (timeout) {
					clearTimeout(timeout);
					timeout = null;
				};
				timeout = setTimeout(function() {
					Session.set('clickedAttended', true);
					changeAttend(id, 1);
					var currentWeek = 'Week ' + Session.get('selectedWeek');
					var currentMonth = Session.get('selectedMonth');
					Meteor.call('changeAttendance', id, 1, currentMonth, currentWeek);
					Meteor.call('calculateAttendance', id);
				}, 100);
			},
			'click .notAttend' : function() {
				var id = this._id;
				if (timeout) {
					clearTimeout(timeout);
					timeout = null;
				};
				timeout = setTimeout(function() {
					Session.set('clickedAttended', false);
					changeAttend(id, 0);
					var currentWeek = 'Week ' + Session.get('selectedWeek');
					var currentMonth = Session.get('selectedMonth');
					Meteor.call('changeAttendance', id, 0, currentMonth, currentWeek);
					Meteor.call('calculateAttendance', id);
				}, 100);
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
		} else {
			var maybeWeek = Session.get('selectedWeek');
			console.log(Session.get('selectedWeek'));
			maybeWeek = "Week " + maybeWeek;
			var monthWeek = mObj.weights[selectedMonth][maybeWeek].exercises;
			var mName = mObj.info[0].name;
			result.push({mID: objID, name: 'name', value: mName});	
			for (var key in monthWeek) {
				var val = monthWeek[key].split('-');
				if (val[0] == "") {break} else {
					result.push({mID: objID, name: key, value: val[1]})
				};
			}
			var maybeAttend = mObj.weights[selectedMonth][maybeWeek].attendance;
			maybeAttend == 1 ? changeAttend(objID, 1) : changeAttend(objID, 0);
		};
		return result;
	});
};

function changeAttend(id, attend) {
	var attendClass;
	var glyph;
	if (attend == 1) {
		attendClass = 'notAttend';
		glyph = 'ok';
	} else {
		attendClass = 'attend';
		glyph = 'remove'
	};
	document.getElementById(id).innerHTML = 
		'<button type="button" mID="' + id + '" class="' + attendClass + 
			' btn btn-default" aria-label="Left Align"><span class="glyphicon glyphicon-' + 
				glyph + '" aria-hidden="true"></span> </button>';
};

