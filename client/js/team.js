if (Meteor.isClient) {
	Meteor.subscribe('members');

	Template.team.helpers({
		'members' : function() {
			return Members.find({member: {$exists: true}}).fetch();
		},
		'months' : function() {
			return Months.findOne().months;
		},
		'weeks' : function() {
			var selectedMonth = Session.get('selectedMonth');
			var count = Workouts.find({'month.current': selectedMonth}).fetch();
			var weeks = [];
			for(i = 0; i < count.length; i++){
				var weekNum = count[i].month.week;
				weeks.push(weekNum);
			}
			console.log(weeks);
			return weeks;
		},
		//Another way to do without hardcoding?
		'headers' : function () {
			var selectedMonth = Session.get('selectedMonth');
			var headings = [];
			var array = [];
			if (selectedMonth == null || selectedMonth == 'Member Info'){
				headings = Members.findOne().member.info;
				for (var key in headings){
					array.push(key);
				};
			} else {
				var maybeWeek = Session.get('selectedWeek');
				maybeWeek ? "" : maybeWeek = '1';
				maybeWeek = "Week " + maybeWeek;
				headings = Members.findOne().member.weights[selectedMonth][maybeWeek];
				array.push('name');
				for (var key in headings) {

					var eName = (headings[key].split('-'))[0];
					if (eName == ""){ break;} else{
						array.push(eName);
					}
				};
				console.log(array);
			}
			return _.map(array, function(value) {
					return {heading: value}
				});	
		},
		'show' : function() {
			return Session.get('warning');
		}
			
	});
	
	Template.team.events({
		'click .add' : function() {
			Meteor.call('insertMember', "", "", "", "", "");
		},
		'click .trash' : function() {
	  		Session.set('warning', true);
	  		Session.set('deleteID', this._id);
	  		console.log('clicked');
	  	},
	  	'click .month li.selected' : function(event) {
	  		Session.set('selectedMonth', event.target.text);
	  	},
	  	'click #week li.selected' : function(event) {
	  		Session.set('selectedWeek', event.target.text);
	  	}
	});
};

