if (Meteor.isClient) {
	Meteor.subscribe('members');

	Template.team.helpers({
		'members' : function() {
			return Members.find({member: {$exists: true}}, 
				{sort: {'member.info[0].name': 1}}).fetch();
		},
		'months' : function() {
			return Months.findOne().months;
		},
		'weeks' : function() {
			var selectedMonth = Session.get('selectedMonth');
			var count = Workouts.find({'month.current': selectedMonth}, 
				{sort:{'month.week': 1}}).fetch();
			var weeks = [];
			for(i = 0; i < count.length; i++){
				var weekNum = count[i].month.week;
				weeks.push(weekNum);
			}
			return weeks;
		},
		'headers' : function () {
			var selectedMonth = Session.get('selectedMonth');
			var headings = [];
			var array = [];
			if (selectedMonth == null || selectedMonth == 'Member Info'){
				headings = Members.findOne().member.info;
				for (var obj in headings){
					for (var key in headings[obj]) {
						array.push(key);
					};
				};
			} else {
				var maybeWeek = Session.get('selectedWeek');
				maybeWeek ? "" : maybeWeek = '1';
				maybeWeek = "Week " + maybeWeek;
				headings = Members.findOne().member.weights[selectedMonth][maybeWeek].exercises;
				array.push('name');
				for (var key in headings) {

					var eName = (headings[key].split('-'))[0];
					if (eName == ""){ break;} else{
						array.push(eName);
					}
				};
			}
			return _.map(array, function(value) {
					return {heading: value}
				});	
		},
		'show' : function() {
			return Session.get('warning');
		},
		'setDrop' : function() {
			return Session.get('selectedMonth');
		},
		'monthSelected' : function() {
			var maybeMonth = Session.get('selectedMonth');
			if (maybeMonth == 'Member Info' || maybeMonth == null){
				return false;
			} else { return true; 
			};
		},
	});
	
	Template.team.events({
		'click .add' : function() {
			Meteor.call('insertMember', "", "", "", "", "");
		},
		'click .trash' : function() {
	  		Session.set('warning', true);
	  		Session.set('deleteID', this._id);
	  	},
	  	'click .month li.selected' : function(event) {
	  		var maybeMonth = event.target.text;
	  		Session.set('selectedMonth', maybeMonth);
	  		maybeMonth === 'Member Info' ? 
	  			Session.set('selectedWeek', false) : Session.set('selectedWeek', 1);
	  	},
	  	'click #week li.selected' : function(event) {
	  		Session.set('selectedWeek', event.target.text);
	  	},
	  	'click #nextWeek' : function() {
			var currentMonth = Session.get('selectedMonth');
			var count = Workouts.findOne({'month.current': currentMonth}, {sort:{month: {week: -1}}});
	  		var currentWeek = Session.get('selectedWeek');
	  		currentWeek < count.month.week ? Session.set('selectedWeek', parseInt(currentWeek) + 1) : "";
	  	},
	  	'click #prevWeek' : function() {
	  		var currentMonth = Session.get('selectedMonth');
			var count = Workouts.findOne({'month.current': currentMonth}, {sort:{month: {week: -1}}});
	  		var currentWeek = Session.get('selectedWeek');
	  		currentWeek > 1 ? Session.set('selectedWeek', parseInt(currentWeek) - 1) : "";
	  	}
	});
};

