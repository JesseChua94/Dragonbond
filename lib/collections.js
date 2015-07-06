Members = new Mongo.Collection("members");
Workouts = new Mongo.Collection("workouts");
Months = new Mongo.Collection("months");

Months.insert({
	index : 0,
	months : ['September', 'October', 'November', 'December', 'January', 'February', 'March', 'April', 'May'] });



/*{name: john,
weight: 120,
email: com.hotmail,
phone: 111 1111111,
week: {weekOne:{
			lat pull-downs: 140
			deadlifts: 240
			squats: 220
			},
	   weekTwo: {...}
	}
}*/

