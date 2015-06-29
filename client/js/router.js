Router.configure({
	layoutTemplate: 'layout' 
});


Router.map(function() {
	this.route('home', {path: '/'});
	this.route('team', {path:'/team'});
	this.route('workouts', {path:'/workouts'});
});